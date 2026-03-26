import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectClient from "./ProjectClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getProjects() {
  const res = await fetch(`${BASE_URL}/api/projects`);

  if (!res.ok) throw new Error("Failed to fetch projects");

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const projects = await getProjects();
  const project = projects.find((p: any) => String(p.id) === String(params.id));

  return {
    title: project?.title ?? "Project",
    description: project?.excerpt ?? "Project details",
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((p: any) => ({
    id: String(p.id),
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const projects = await getProjects();

  const project = projects.find((p: any) => String(p.id) === String(params.id));

  if (!project) notFound();

  return <ProjectClient project={project} />;
}
