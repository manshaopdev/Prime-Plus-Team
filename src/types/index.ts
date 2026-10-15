export type ServiceCategory = 'web_dev' | 'graphic_design' | 'digital_marketing';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type UserRole = 'lead' | 'developer' | 'designer' | 'marketer' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  activeStatusText: string;
  department?: string;
  company?: string;
  phone?: string;
  isBanned?: boolean;
  banReason?: string;
  createdAt?: string;
  password?: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  serviceCategory: ServiceCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // User ID
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  checklist: { id: string; text: string; completed: boolean }[];
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  deliverableLink?: string;
}

export interface ProjectDeliverable {
  id: string;
  title: string;
  serviceCategory: ServiceCategory;
  previewUrl?: string;
  previewImage?: string;
  status: 'pending_review' | 'approved' | 'revision_requested';
  submittedDate: string;
  clientFeedback?: string;
  version: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  clientName: string;
  clientCompany: string;
  serviceCategories: ServiceCategory[];
  progressPercent: number;
  status: 'Discovery' | 'In Progress' | 'In Review' | 'Completed';
  startDate: string;
  deadline: string;
  budgetTotal: number;
  budgetSpent: number;
  teamMembers: string[]; // User IDs
  summary: string;
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  channelId: string;
  reactions: { emoji: string; count: number; users: string[] }[];
  attachmentName?: string;
}

export interface ServiceDetail {
  id: ServiceCategory;
  name: string;
  tagline: string;
  description: string;
  image: string;
  capabilities: string[];
  packages: {
    tier: string;
    price: string;
    turnaround: string;
    features: string[];
    isPopular?: boolean;
  }[];
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'due';
  items: { description: string; qty: number; unitPrice: number }[];
}
