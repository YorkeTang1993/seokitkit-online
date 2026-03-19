'use client';

import { useState, useCallback, useMemo } from 'react';

type SchemaType = 'Article' | 'Product' | 'FAQ' | 'LocalBusiness' | 'Organization' | 'Person' | 'Event' | 'Recipe' | 'HowTo' | 'BreadcrumbList';

interface FAQItem { question: string; answer: string; }
interface BreadcrumbItem { name: string; url: string; }
interface HowToStep { name: string; text: string; }

export default function ToolClient() {
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [copied, setCopied] = useState(false);

  // Article
  const [headline, setHeadline] = useState('How to Improve Your SEO Rankings');
  const [author, setAuthor] = useState('John Smith');
  const [datePublished, setDatePublished] = useState('2026-01-15');
  const [articleImage, setArticleImage] = useState('https://example.com/image.jpg');
  const [publisher, setPublisher] = useState('Example Blog');

  // Product
  const [productName, setProductName] = useState('Premium SEO Toolkit');
  const [productDesc, setProductDesc] = useState('Complete SEO analysis and optimization toolkit');
  const [price, setPrice] = useState('49.99');
  const [currency, setCurrency] = useState('USD');
  const [availability, setAvailability] = useState('InStock');
  const [brand, setBrand] = useState('SEOKit');

  // FAQ
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { question: 'What is SEO?', answer: 'SEO stands for Search Engine Optimization, the practice of improving your website to increase its visibility in search results.' },
    { question: 'How long does SEO take?', answer: 'SEO results typically take 3-6 months to become noticeable, depending on competition and effort.' },
  ]);

  // LocalBusiness
  const [bizName, setBizName] = useState('Example Coffee Shop');
  const [bizStreet, setBizStreet] = useState('123 Main Street');
  const [bizCity, setBizCity] = useState('San Francisco');
  const [bizState, setBizState] = useState('CA');
  const [bizZip, setBizZip] = useState('94105');
  const [bizCountry, setBizCountry] = useState('US');
  const [bizPhone, setBizPhone] = useState('+1-415-555-0123');
  const [bizLat, setBizLat] = useState('37.7749');
  const [bizLng, setBizLng] = useState('-122.4194');

  // Organization
  const [orgName, setOrgName] = useState('Example Corp');
  const [orgUrl, setOrgUrl] = useState('https://example.com');
  const [orgLogo, setOrgLogo] = useState('https://example.com/logo.png');

  // Person
  const [personName, setPersonName] = useState('Jane Doe');
  const [personUrl, setPersonUrl] = useState('https://janedoe.com');
  const [personJobTitle, setPersonJobTitle] = useState('SEO Specialist');

  // Event
  const [eventName, setEventName] = useState('SEO Workshop 2026');
  const [eventStart, setEventStart] = useState('2026-06-15T09:00');
  const [eventEnd, setEventEnd] = useState('2026-06-15T17:00');
  const [eventLocation, setEventLocation] = useState('San Francisco Convention Center');

  // Recipe
  const [recipeName, setRecipeName] = useState('Chocolate Chip Cookies');
  const [recipePrepTime, setRecipePrepTime] = useState('15');
  const [recipeCookTime, setRecipeCookTime] = useState('12');
  const [recipeYield, setRecipeYield] = useState('24 cookies');

  // HowTo
  const [howToName, setHowToName] = useState('How to Add Schema Markup');
  const [howToSteps, setHowToSteps] = useState<HowToStep[]>([
    { name: 'Choose schema type', text: 'Select the appropriate schema type for your content.' },
    { name: 'Fill in the fields', text: 'Enter the required information for your chosen schema type.' },
  ]);

  // BreadcrumbList
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: 'SEO Tips', url: 'https://example.com/blog/seo-tips' },
  ]);

  const jsonLd = useMemo(() => {
    let data: Record<string, unknown> = { '@context': 'https://schema.org' };

    switch (schemaType) {
      case 'Article':
        data = { ...data, '@type': 'Article', headline, author: { '@type': 'Person', name: author }, datePublished, image: articleImage, publisher: { '@type': 'Organization', name: publisher } };
        break;
      case 'Product':
        data = { ...data, '@type': 'Product', name: productName, description: productDesc, brand: { '@type': 'Brand', name: brand }, offers: { '@type': 'Offer', price, priceCurrency: currency, availability: `https://schema.org/${availability}` } };
        break;
      case 'FAQ':
        data = { ...data, '@type': 'FAQPage', mainEntity: faqItems.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };
        break;
      case 'LocalBusiness':
        data = { ...data, '@type': 'LocalBusiness', name: bizName, address: { '@type': 'PostalAddress', streetAddress: bizStreet, addressLocality: bizCity, addressRegion: bizState, postalCode: bizZip, addressCountry: bizCountry }, telephone: bizPhone, geo: { '@type': 'GeoCoordinates', latitude: bizLat, longitude: bizLng } };
        break;
      case 'Organization':
        data = { ...data, '@type': 'Organization', name: orgName, url: orgUrl, logo: orgLogo };
        break;
      case 'Person':
        data = { ...data, '@type': 'Person', name: personName, url: personUrl, jobTitle: personJobTitle };
        break;
      case 'Event':
        data = { ...data, '@type': 'Event', name: eventName, startDate: eventStart, endDate: eventEnd, location: { '@type': 'Place', name: eventLocation } };
        break;
      case 'Recipe':
        data = { ...data, '@type': 'Recipe', name: recipeName, prepTime: `PT${recipePrepTime}M`, cookTime: `PT${recipeCookTime}M`, recipeYield: recipeYield };
        break;
      case 'HowTo':
        data = { ...data, '@type': 'HowTo', name: howToName, step: howToSteps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })) };
        break;
      case 'BreadcrumbList':
        data = { ...data, '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })) };
        break;
    }
    return JSON.stringify(data, null, 2);
  }, [schemaType, headline, author, datePublished, articleImage, publisher, productName, productDesc, price, currency, availability, brand, faqItems, bizName, bizStreet, bizCity, bizState, bizZip, bizCountry, bizPhone, bizLat, bizLng, orgName, orgUrl, orgLogo, personName, personUrl, personJobTitle, eventName, eventStart, eventEnd, eventLocation, recipeName, recipePrepTime, recipeCookTime, recipeYield, howToName, howToSteps, breadcrumbs]);

  const copyOutput = useCallback(() => {
    const wrapped = `<script type="application/ld+json">\n${jsonLd}\n</script>`;
    navigator.clipboard.writeText(wrapped);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [jsonLd]);

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  const renderFields = () => {
    switch (schemaType) {
      case 'Article':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Headline</label><input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Published</label><input type="date" value={datePublished} onChange={e => setDatePublished(e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="text" value={articleImage} onChange={e => setArticleImage(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Publisher Name</label><input type="text" value={publisher} onChange={e => setPublisher(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case 'Product':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label><input type="text" value={productName} onChange={e => setProductName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={2} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Price</label><input type="text" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls}><option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option><option>CAD</option><option>AUD</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Availability</label><select value={availability} onChange={e => setAvailability(e.target.value)} className={inputCls}><option value="InStock">In Stock</option><option value="OutOfStock">Out of Stock</option><option value="PreOrder">Pre-Order</option></select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case 'FAQ':
        return (
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-gray-500">Q&A #{i + 1}</span>{faqItems.length > 1 && <button onClick={() => setFaqItems(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">Remove</button>}</div>
                <input type="text" value={item.question} onChange={e => setFaqItems(prev => prev.map((f, idx) => idx === i ? { ...f, question: e.target.value } : f))} placeholder="Question" className={inputCls} />
                <textarea value={item.answer} onChange={e => setFaqItems(prev => prev.map((f, idx) => idx === i ? { ...f, answer: e.target.value } : f))} placeholder="Answer" rows={2} className={inputCls} />
              </div>
            ))}
            <button onClick={() => setFaqItems(prev => [...prev, { question: '', answer: '' }])} className="text-sm text-blue-600 hover:text-blue-800">+ Add Question</button>
          </div>
        );
      case 'LocalBusiness':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input type="text" value={bizName} onChange={e => setBizName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input type="text" value={bizStreet} onChange={e => setBizStreet(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={bizCity} onChange={e => setBizCity(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={bizState} onChange={e => setBizState(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label><input type="text" value={bizZip} onChange={e => setBizZip(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={bizCountry} onChange={e => setBizCountry(e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={bizPhone} onChange={e => setBizPhone(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label><input type="text" value={bizLat} onChange={e => setBizLat(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label><input type="text" value={bizLng} onChange={e => setBizLng(e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        );
      case 'Organization':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label><input type="text" value={orgUrl} onChange={e => setOrgUrl(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label><input type="text" value={orgLogo} onChange={e => setOrgLogo(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case 'Person':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={personName} onChange={e => setPersonName(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">URL</label><input type="text" value={personUrl} onChange={e => setPersonUrl(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input type="text" value={personJobTitle} onChange={e => setPersonJobTitle(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case 'Event':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label><input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label><input type="datetime-local" value={eventStart} onChange={e => setEventStart(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label><input type="datetime-local" value={eventEnd} onChange={e => setEventEnd(e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case 'Recipe':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label><input type="text" value={recipeName} onChange={e => setRecipeName(e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label><input type="number" value={recipePrepTime} onChange={e => setRecipePrepTime(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label><input type="number" value={recipeCookTime} onChange={e => setRecipeCookTime(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Yield</label><input type="text" value={recipeYield} onChange={e => setRecipeYield(e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        );
      case 'HowTo':
        return (
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={howToName} onChange={e => setHowToName(e.target.value)} className={inputCls} /></div>
            {howToSteps.map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-gray-500">Step {i + 1}</span>{howToSteps.length > 1 && <button onClick={() => setHowToSteps(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">Remove</button>}</div>
                <input type="text" value={step.name} onChange={e => setHowToSteps(prev => prev.map((s, idx) => idx === i ? { ...s, name: e.target.value } : s))} placeholder="Step name" className={inputCls} />
                <textarea value={step.text} onChange={e => setHowToSteps(prev => prev.map((s, idx) => idx === i ? { ...s, text: e.target.value } : s))} placeholder="Step description" rows={2} className={inputCls} />
              </div>
            ))}
            <button onClick={() => setHowToSteps(prev => [...prev, { name: '', text: '' }])} className="text-sm text-blue-600 hover:text-blue-800">+ Add Step</button>
          </div>
        );
      case 'BreadcrumbList':
        return (
          <div className="space-y-3">
            {breadcrumbs.map((bc, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-6">{i + 1}.</span>
                <input type="text" value={bc.name} onChange={e => setBreadcrumbs(prev => prev.map((b, idx) => idx === i ? { ...b, name: e.target.value } : b))} placeholder="Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" value={bc.url} onChange={e => setBreadcrumbs(prev => prev.map((b, idx) => idx === i ? { ...b, url: e.target.value } : b))} placeholder="URL" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                {breadcrumbs.length > 1 && <button onClick={() => setBreadcrumbs(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">x</button>}
              </div>
            ))}
            <button onClick={() => setBreadcrumbs(prev => [...prev, { name: '', url: '' }])} className="text-sm text-blue-600 hover:text-blue-800">+ Add Item</button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
        <select value={schemaType} onChange={e => setSchemaType(e.target.value as SchemaType)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          {(['Article', 'Product', 'FAQ', 'LocalBusiness', 'Organization', 'Person', 'Event', 'Recipe', 'HowTo', 'BreadcrumbList'] as SchemaType[]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {renderFields()}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Generated JSON-LD</label>
          <button onClick={copyOutput} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto min-h-[200px]">
          <code>{jsonLd}</code>
        </pre>
      </div>
    </div>
  );
}
