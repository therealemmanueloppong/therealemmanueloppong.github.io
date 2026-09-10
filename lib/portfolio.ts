import profile from "@/data/profile.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import education from "@/data/education.json";
import contact from "@/data/contact.json";
import type { Contact, Education, Experience, PortfolioContext, Profile, Project, SkillGroup } from "./types";

// JSON is the V1 CMS. The casts keep the imported runtime JSON independent from the UI types.
export const portfolioContext: PortfolioContext = {
  profile: profile as Profile,
  experience: experience as Experience[],
  projects: projects as Project[],
  skills: skills as SkillGroup[],
  education: education as Education[],
  contact: contact as Contact,
};
