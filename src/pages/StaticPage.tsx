import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Banner } from '@bettergov/kapwa/banner';
import { Card, CardHeader } from '@bettergov/kapwa/card';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { createMarkdownComponents } from '../lib/markdownComponents';
import { getTypographyTheme } from '../lib/typographyThemes';
import { loadStaticPage, type MarkdownContent } from '../lib/markdownLoader';

export default function StaticPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<MarkdownContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const components = createMarkdownComponents(getTypographyTheme('default'));

  useEffect(() => {
    let cancelled = false;
    loadStaticPage(slug)
      .then(result => {
        if (!cancelled) setPage(result);
      })
      .catch(() => {
        if (!cancelled) setError('This page could not be found.');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <Section className="p-3 mb-12">
        <Banner type="error" title="Page Not Found" description={error} icon />
      </Section>
    );
  }
  if (!page) {
    return (
      <Section className="p-3 mb-12">
        <Banner type="info" description="Loading..." />
      </Section>
    );
  }
  return (
    <>
      <SEO title={page.title || slug} description={page.description} />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: page.title ?? slug }]}
        />
        <Card className="mb-8 markdown-content">
          <CardHeader>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {page.content}
            </ReactMarkdown>
          </CardHeader>
        </Card>
      </Section>
    </>
  );
}
