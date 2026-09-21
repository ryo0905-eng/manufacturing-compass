import { notFound, permanentRedirect } from "next/navigation";
import { companies, getCompanyBySlug } from "@/data/companies";

type CareerPrepPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export default async function CareerPrepPage({ params }: CareerPrepPageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  permanentRedirect(`/companies/${company.slug}#career-prep`);
}
