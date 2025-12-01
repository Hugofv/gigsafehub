'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  locale: string;
}

export default function ShareButtons({ url, title, description, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  // Use provided URL or current pathname
  const articlePath = url || pathname || '';
  const fullUrl = articlePath.startsWith('http') ? articlePath : `${baseUrl}${articlePath}`;
  const shareText = description || title;
  const isPortuguese = locale === 'pt-BR';

  // Build beautiful, personalized messages for each platform
  const buildShareMessages = () => {
    const hashtags = isPortuguese
      ? '#Seguros #EconomiaGig #GigSafeHub'
      : '#Insurance #GigEconomy #GigSafeHub';

    // Helper to truncate text to fit platform limits
    const truncate = (text: string, maxLength: number) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    };

    // Twitter/X - Limit 280 characters (URL counts as 23 chars)
    // Calculate available space: 280 - 23 (URL) - formatting = ~250 chars
    const titleLength = title.length;
    const descMaxLength = Math.max(0, 200 - titleLength);
    const twitterText = isPortuguese
      ? `${title}\n\n${truncate(description || 'Artigo interessante sobre seguros para trabalhadores da economia gig.', descMaxLength)}\n\n${hashtags}`
      : `${title}\n\n${truncate(description || 'Interesting article about insurance for gig economy workers.', descMaxLength)}\n\n${hashtags}`;
    const twitterMessage = twitterText;

    // WhatsApp - More conversational and friendly
    const whatsappMessage = isPortuguese
      ? `*${title}*\n\n${description || 'Artigo interessante sobre seguros para trabalhadores da economia gig.'}\n\n*GigSafeHub*\nProteção e segurança para profissionais autônomos, motoristas de app e freelancers!\n\n🔗 ${fullUrl}\n\n${hashtags}`
      : `*${title}*\n\n${description || 'Interesting article about insurance for gig economy workers.'}\n\n*GigSafeHub*\nProtection and security for freelancers, rideshare drivers, and gig workers!\n\n🔗 ${fullUrl}\n\n${hashtags}`;

    // Telegram - Similar to WhatsApp but slightly shorter
    const telegramMessage = isPortuguese
      ? `*${title}*\n\n${truncate(description || 'Artigo interessante sobre seguros para trabalhadores da economia gig.', 200)}\n\n*GigSafeHub* - Proteção para profissionais autônomos\n\n🔗 ${fullUrl}`
      : `*${title}*\n\n${truncate(description || 'Interesting article about insurance for gig economy workers.', 200)}\n\n*GigSafeHub* - Protection for gig workers\n\n🔗 ${fullUrl}`;

    // Reddit - More descriptive title
    const redditTitle = isPortuguese
      ? `${title} | GigSafeHub - Guia de Seguros para Economia Gig`
      : `${title} | GigSafeHub - Insurance Guide for Gig Economy`;

    // Email - Professional and elegant format
    const emailSubject = isPortuguese
      ? `${title} | GigSafeHub`
      : `${title} | GigSafeHub`;

    const emailBody = isPortuguese
      ? `Olá!

Gostaria de compartilhar este artigo interessante do GigSafeHub:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${title}

${description || 'Artigo sobre proteção e segurança para trabalhadores da economia gig.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Leia o artigo completo:
🔗 ${fullUrl}

💼 GigSafeHub - Proteção e segurança para trabalhadores da economia gig
🌐 gigsafehub.com

${hashtags}`
      : `Hello!

I'd like to share this interesting article from GigSafeHub:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${title}

${description || 'Article about protection and security for gig economy workers.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Read the full article:
🔗 ${fullUrl}

💼 GigSafeHub - Protection and security for gig economy workers
🌐 gigsafehub.com

${hashtags}`;

    return {
      twitter: twitterMessage,
      whatsapp: whatsappMessage,
      telegram: telegramMessage,
      reddit: redditTitle,
      emailSubject,
      emailBody,
    };
  };

  const messages = buildShareMessages();

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(messages.telegram)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(messages.reddit)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullUrl)}&description=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(messages.emailSubject)}&body=${encodeURIComponent(messages.emailBody)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks, e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = shareLinks[platform];

    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareButtonClass = "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-md";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={(e) => handleShare('facebook', e)}
        className={`${shareButtonClass} bg-[#1877F2] text-white hover:bg-[#166FE5]`}
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('twitter', e)}
        className={`${shareButtonClass} bg-[#1DA1F2] text-white hover:bg-[#1a91da]`}
        aria-label="Share on Twitter/X"
        title="Twitter/X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('linkedin', e)}
        className={`${shareButtonClass} bg-[#0A66C2] text-white hover:bg-[#095195]`}
        aria-label="Share on LinkedIn"
        title="LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('whatsapp', e)}
        className={`${shareButtonClass} bg-[#25D366] text-white hover:bg-[#20BA5A]`}
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('telegram', e)}
        className={`${shareButtonClass} bg-[#0088cc] text-white hover:bg-[#0077b5]`}
        aria-label="Share on Telegram"
        title="Telegram"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('reddit', e)}
        className={`${shareButtonClass} bg-[#FF4500] text-white hover:bg-[#E63900]`}
        aria-label="Share on Reddit"
        title="Reddit"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('pinterest', e)}
        className={`${shareButtonClass} bg-[#BD081C] text-white hover:bg-[#A30717]`}
        aria-label="Share on Pinterest"
        title="Pinterest"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.487.535 6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.966.026L12.017 0z"/>
        </svg>
      </button>

      <button
        onClick={(e) => handleShare('email', e)}
        className={`${shareButtonClass} bg-slate-600 text-white hover:bg-slate-700`}
        aria-label="Share via Email"
        title={locale === 'pt-BR' ? 'Enviar por email' : 'Email'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      <button
        onClick={handleCopyLink}
        className={`${shareButtonClass} bg-slate-500 text-white hover:bg-slate-600`}
        aria-label={locale === 'pt-BR' ? 'Copiar link' : 'Copy link'}
        title={locale === 'pt-BR' ? 'Copiar link' : 'Copy link'}
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

