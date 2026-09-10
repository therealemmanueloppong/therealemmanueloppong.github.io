export interface Profile { name: string; title: string; headline: string; summary: string; availability: string; resumeUrl: string }
export interface Experience { organization: string; role: string; type: "internship" | "full-time" | "part-time" | "contract" | "other"; location: string; startDate: string; endDate: string; description: string; technologies: string[]; highlights: string[] }
export interface Project { name: string; slug: string; description: string; longDescription: string; technologies: string[]; links: { github: string; demo: string } }
export interface SkillGroup { category: string; items: string[] }
export interface Education { institution: string; degree: string; location: string; details: string; duration: string }
export interface Contact { email: string; github: string; linkedin: string }
export interface PortfolioContext { profile: Profile; experience: Experience[]; projects: Project[]; skills: SkillGroup[]; education: Education[]; contact: Contact }
