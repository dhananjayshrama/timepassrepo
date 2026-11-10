import {
  Code, Monitor, Server, Shield, Cloud, BarChart3, GitBranch, Smartphone,
  Palette, Brain, Bug, Database, Users, Target, Megaphone, Headphones,
  ClipboardList, Briefcase, Calculator, FileSearch, Receipt, TrendingUp,
  Wallet, Landmark, PenTool, FileText, GraduationCap, Newspaper, Video,
  HeartHandshake, Store, Building2, ShieldCheck, Rocket, Stethoscope,
  Scale, Flag, Laptop, Cpu, Layers, MessageCircle,
} from "lucide-react";

export const FIELDS = [
  { id: "technical", label: "Technical", icon: Cpu },
  { id: "non-technical", label: "Non-Technical", icon: Briefcase },
  { id: "accounts", label: "Accounts", icon: Calculator },
  { id: "arts", label: "Arts", icon: Palette },
  { id: "commerce", label: "Commerce", icon: Store },
  { id: "other", label: "Other", icon: Layers },
];

export const ROLES = {
  technical: [
    { label: "Full Stack", icon: Code, description: "Build complete web apps, from the screen users see to the database behind it.", tags: ["React", "Node.js", "APIs"] },
    { label: "Frontend", icon: Monitor, description: "Create fast, beautiful and accessible interfaces that people enjoy using.", tags: ["HTML/CSS", "JavaScript", "React"] },
    { label: "Backend", icon: Server, description: "Design the servers, APIs and logic that power every application.", tags: ["Node.js", "Databases", "Auth"] },
    { label: "Cybersecurity", icon: Shield, description: "Protect systems and data by finding weak spots before attackers do.", tags: ["Networks", "Threats", "Encryption"] },
    { label: "Cloud", icon: Cloud, description: "Run and scale applications on cloud platforms reliably and cost-effectively.", tags: ["AWS", "Scaling", "Storage"] },
    { label: "Data Scientist", icon: BarChart3, description: "Turn raw data into insights and predictions that guide big decisions.", tags: ["Python", "Statistics", "ML"] },
    { label: "DevOps", icon: GitBranch, description: "Automate building, testing and shipping so releases are smooth and safe.", tags: ["CI/CD", "Docker", "Linux"] },
    { label: "Mobile App", icon: Smartphone, description: "Build apps for phones that feel quick, smooth and natural to use.", tags: ["React Native", "Android", "iOS"] },
    { label: "UI/UX Designer", icon: Palette, description: "Shape how products look and feel by understanding what users really need.", tags: ["Wireframes", "Research", "Figma"] },
    { label: "Machine Learning", icon: Brain, description: "Train models that learn from data to recognize, predict and generate.", tags: ["Models", "Python", "Deep Learning"] },
    { label: "QA Testing", icon: Bug, description: "Catch bugs early and make sure every release works the way it should.", tags: ["Test Cases", "Automation", "Bugs"] },
    { label: "Data Analyst", icon: Database, description: "Clean, query and visualize data to answer business questions clearly.", tags: ["SQL", "Excel", "Dashboards"] },
  ],
  "non-technical": [
    { label: "HR Executive", icon: Users, description: "Hire the right people and build a healthy, motivated workplace.", tags: ["Recruitment", "Policies", "Payroll"] },
    { label: "Sales Executive", icon: Target, description: "Understand customers, pitch with confidence and close deals.", tags: ["Pitching", "Leads", "Negotiation"] },
    { label: "Digital Marketing", icon: Megaphone, description: "Grow a brand online using content, ads and social media.", tags: ["SEO", "Ads", "Social Media"] },
    { label: "Customer Support", icon: Headphones, description: "Solve customer problems with patience, clarity and a smile.", tags: ["Communication", "Empathy", "Tickets"] },
    { label: "Project Manager", icon: ClipboardList, description: "Plan work, lead teams and deliver projects on time.", tags: ["Planning", "Teams", "Deadlines"] },
    { label: "Business Analyst", icon: Briefcase, description: "Connect business needs with practical solutions and clear requirements.", tags: ["Requirements", "Reports", "Process"] },
  ],
  accounts: [
    { label: "Accountant", icon: Calculator, description: "Keep books accurate and finances in order, day after day.", tags: ["Tally", "Ledgers", "GST"] },
    { label: "Auditor", icon: FileSearch, description: "Review records carefully to make sure everything is correct and compliant.", tags: ["Audit", "Compliance", "Checks"] },
    { label: "Tax Consultant", icon: Receipt, description: "Guide people and businesses through tax rules and filing.", tags: ["Income Tax", "GST", "Filing"] },
    { label: "Financial Analyst", icon: TrendingUp, description: "Study numbers and trends to help companies make smart money decisions.", tags: ["Budgets", "Forecasts", "Excel"] },
    { label: "Payroll Executive", icon: Wallet, description: "Make sure every employee is paid correctly and on time.", tags: ["Salary", "PF/ESI", "Records"] },
    { label: "Banking", icon: Landmark, description: "Serve customers and handle accounts, loans and everyday banking.", tags: ["Loans", "Accounts", "KYC"] },
  ],
  arts: [
    { label: "Graphic Designer", icon: PenTool, description: "Turn ideas into eye-catching visuals for brands and campaigns.", tags: ["Photoshop", "Branding", "Layouts"] },
    { label: "Content Writer", icon: FileText, description: "Write clear, engaging words for blogs, websites and businesses.", tags: ["Writing", "SEO", "Editing"] },
    { label: "Teacher", icon: GraduationCap, description: "Explain ideas simply and inspire students to keep learning.", tags: ["Teaching", "Classroom", "Subjects"] },
    { label: "Journalist", icon: Newspaper, description: "Find the facts, tell true stories and report them well.", tags: ["Reporting", "Ethics", "Interviews"] },
    { label: "Video Editor", icon: Video, description: "Cut and shape raw footage into stories people want to watch.", tags: ["Editing", "Storytelling", "Effects"] },
    { label: "Social Worker", icon: HeartHandshake, description: "Support people and communities who need help the most.", tags: ["Community", "Counselling", "NGO"] },
  ],
  commerce: [
    { label: "Business Manager", icon: Building2, description: "Run teams and operations so the business keeps growing.", tags: ["Leadership", "Strategy", "Operations"] },
    { label: "Retail Manager", icon: Store, description: "Manage stores, stock and staff to keep customers happy.", tags: ["Inventory", "Staff", "Customers"] },
    { label: "Stock Market Analyst", icon: TrendingUp, description: "Read the market and research companies to guide investment choices.", tags: ["Equity", "Research", "Risk"] },
    { label: "Insurance Advisor", icon: ShieldCheck, description: "Help families and businesses choose the right protection.", tags: ["Policies", "Claims", "Advice"] },
    { label: "Entrepreneur", icon: Rocket, description: "Turn a business idea into a real, growing company.", tags: ["Startups", "Funding", "Planning"] },
    { label: "Banking Officer", icon: Landmark, description: "Prepare for bank exams and interviews with confidence.", tags: ["IBPS", "Banking Laws", "Customer Care"] },
  ],
  other: [
    { label: "English Speaking", icon: MessageCircle, description: "Improve fluency, vocabulary and confidence by speaking English in real interview situations.", tags: ["Fluency", "Vocabulary", "Confidence"] },
    { label: "Civil Services", icon: Scale, description: "Practice for UPSC and MPSC style personality tests.", tags: ["UPSC", "MPSC", "Opinion"] },
    { label: "Healthcare", icon: Stethoscope, description: "Practice for roles where care, calm and accuracy come first.", tags: ["Patient Care", "Basics", "Ethics"] },
    { label: "Freelancer", icon: Laptop, description: "Win clients and deliver work as your own boss.", tags: ["Clients", "Pricing", "Portfolio"] },
    { label: "Fresher / HR Round", icon: Users, description: "Common first-job questions every fresher gets asked.", tags: ["Introduction", "Strengths", "Goals"] },
    { label: "General Interview", icon: Briefcase, description: "Practice general questions that work for any job.", tags: ["Confidence", "Behaviour", "Basics"] },
  ],
};