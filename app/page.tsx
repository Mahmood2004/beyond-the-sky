import HomeClient from "./HomeClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getData() {
  const [services, projects, blogs, news] = await Promise.all([
    fetch(`${BASE_URL}/api/services`).then((res) => res.json()),
    fetch(`${BASE_URL}/api/projects`).then((res) => res.json()),
    fetch(`${BASE_URL}/api/blog`).then((res) => res.json()),
    fetch(`${BASE_URL}/api/news`).then((res) => res.json()),
  ]);

  return { services, projects, blogs, news };
}

export default async function HomePage() {
  const data = await getData();

  return <HomeClient {...data} />;
}
