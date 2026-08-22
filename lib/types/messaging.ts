export type MessageSenderRole = "customer" | "admin";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: MessageSenderRole;
  content: string;
  client_generated_id: string;
  attachment_url: string | null;
  attachment_type: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
};

export type Conversation = {
  id: string;
  puppy_id: string;
  customer_id: string;
  status: "open" | "closed";
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender_role: MessageSenderRole | null;
  created_at: string;
  updated_at: string;
};

export type PuppyConversationContext = {
  id: string;
  name: string;
  breed: string;
  coverImage: string | null;
  breederName: string | null;
  breederPhotoUrl: string | null;
};

export type OptimisticMessage = Message & {
  status?: "sending" | "sent" | "failed";
};