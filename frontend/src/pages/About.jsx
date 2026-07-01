import { useLang } from '../i18n/LangContext.jsx';

export default function About() {
  const { t } = useLang();
  return (
    <>
      <h1 className="section-title">{t('about_title')}</h1>
      <div className="about-block">
        <p>
          Tang Line Trading is a zero-inventory sourcing and procurement agent connecting
          buyers across Ethiopia, Georgia, the UAE, Kazakhstan, Tajikistan, and Russia with
          verified suppliers in China. We don't hold stock — we source, vet, quote, and arrange
          shipping on your behalf, so you get supplier access and quality control without
          warehousing risk.
        </p>
        <p>
          The name draws on Tang Dynasty trade heritage, when the Silk Road connected China to
          the world. Our tagline reflects that spirit: <em>"Trade, the way it was always meant
          to move."</em>
        </p>
        <h3>Our three lines</h3>
        <ul>
          <li><strong>B2B procurement sourcing</strong> — finding and vetting suppliers for your specific product needs.</li>
          <li><strong>Industrial &amp; construction sourcing and export</strong> — machinery and equipment for growing construction markets.</li>
          <li><strong>E-commerce &amp; private label</strong> — sourcing for marketplace sellers across target regions.</li>
        </ul>
        <h3>Why it works</h3>
        <p>
          Every supplier is checked against official business registries, audit reports, and
          prior buyer references before we recommend them — so you're not taking on the risk of
          finding and vetting a factory yourself.
        </p>
      </div>
    </>
  );
}
