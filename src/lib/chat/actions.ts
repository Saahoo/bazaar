import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface Conversation {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  // Joined fields
  listing_title?: string;
  other_user_name?: string;
  other_user_avatar?: string | null;
  last_message?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_text: string;
  file_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  // Joined
  sender_name?: string;
  sender_avatar?: string | null;
}

/** Get or create a conversation between buyer and seller for a listing */
export async function getOrCreateConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<string> {
  // Check existing
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .single();

  if (existing) return existing.id;

  // Create new
  const { data, error } = await supabase
    .from('conversations')
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

/** Get or create a direct conversation between two users without a listing */
export async function getOrCreateDirectConversation(
  buyerId: string,
  sellerId: string
): Promise<string> {
  const { data: existing, error: existingError } = await supabase
    .from('conversations')
    .select('id')
    .is('listing_id', null)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .limit(1);

  if (existingError) throw existingError;
  if (existing && existing.length > 0) return existing[0].id;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ listing_id: null, buyer_id: buyerId, seller_id: sellerId })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

/** Fetch all conversations for current user */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      listing_id,
      buyer_id,
      seller_id,
      last_message_at,
      created_at,
      listings(title),
      buyer:profiles!conversations_buyer_id_fkey(display_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(display_name, avatar_url)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;

  // Fetch last message + unread count for each conversation
  const conversations: Conversation[] = await Promise.all(
    (data || []).map(async (conv: Record<string, unknown>) => {
      const listing = conv.listings as { title: string } | null;
      const buyer = conv.buyer as { display_name: string; avatar_url: string | null } | null;
      const seller = conv.seller as { display_name: string; avatar_url: string | null } | null;

      const isBuyer = conv.buyer_id === userId;
      const other = isBuyer ? seller : buyer;

      // Last message
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('message_text')
        .eq('conversation_id', conv.id as string)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Unread count
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id as string)
        .neq('sender_id', userId)
        .eq('is_read', false);

      return {
        id: conv.id as string,
        listing_id: conv.listing_id as string | null,
        buyer_id: conv.buyer_id as string,
        seller_id: conv.seller_id as string,
        last_message_at: conv.last_message_at as string,
        created_at: conv.created_at as string,
        listing_title: listing?.title || '',
        other_user_name: other?.display_name || 'User',
        other_user_avatar: other?.avatar_url || null,
        last_message: lastMsg?.message_text || '',
        unread_count: count || 0,
      };
    })
  );

  return conversations;
}

/** Fetch messages for a conversation */
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      conversation_id,
      sender_id,
      message_text,
      file_url,
      is_read,
      read_at,
      created_at,
      sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((msg: Record<string, unknown>) => {
    const sender = msg.sender as { display_name: string; avatar_url: string | null } | null;
    return {
      id: msg.id as string,
      conversation_id: msg.conversation_id as string,
      sender_id: msg.sender_id as string,
      message_text: msg.message_text as string,
      file_url: msg.file_url as string | null,
      is_read: msg.is_read as boolean,
      read_at: msg.read_at as string | null,
      created_at: msg.created_at as string,
      sender_name: sender?.display_name || 'User',
      sender_avatar: sender?.avatar_url || null,
    };
  });
}

/** Send a message */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message_text: text,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/** Mark messages as read */
export async function markMessagesAsRead(conversationId: string, userId: string) {
  await supabase
    .from('messages')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('is_read', false);
}

/** Get total unread count across all conversations */
export async function getUnreadCount(userId: string): Promise<number> {
  // Get all conversation IDs the user is part of
  const { data: convs } = await supabase
    .from('conversations')
    .select('id')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  if (!convs || convs.length === 0) return 0;

  const convIds = convs.map((c: { id: string }) => c.id);

  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .in('conversation_id', convIds)
    .neq('sender_id', userId)
    .eq('is_read', false);

  return count || 0;
}

/** Subscribe to new messages in a conversation (Supabase Realtime) */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to all conversation updates for unread badge */
export function subscribeToConversations(
  userId: string,
  onUpdate: () => void
) {
  const uniqueId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const channel = supabase
    .channel(`user-convs:${uniqueId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
