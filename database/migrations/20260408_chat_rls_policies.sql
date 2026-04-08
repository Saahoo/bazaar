DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'conversations' AND policyname = 'Users can delete own conversations'
  ) THEN
    CREATE POLICY "Users can delete own conversations"
      ON conversations FOR DELETE
      USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Users can mark messages as read'
  ) THEN
    CREATE POLICY "Users can mark messages as read"
      ON messages FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM conversations c
          WHERE c.id = messages.conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM conversations c
          WHERE c.id = messages.conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
      );
  END IF;
END $$;
