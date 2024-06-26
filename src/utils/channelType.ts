export type ChannelType =
  | 'Cross Network'
  | 'Paid Search'
  | 'Paid Social'
  | 'Paid Video'
  | 'Paid Shopping'
  | 'Display'
  | 'Paid Unknown'
  | 'Direct'
  | 'Organic Search'
  | 'Organic Social'
  | 'Organic Video'
  | 'Organic Shopping'
  | 'Unknown'
  | 'Email'
  | 'SMS'
  | 'Push'
  | 'Referral'
  | 'Audio'
  | 'Affiliate';

export const getChannelType = (
  utmCampaign: string,
  utmMedium: string,
  utmSource: string,
  referringDomain: string,
  anyClickIdPresent: boolean,
): ChannelType => {
  if (utmCampaign === 'cross-network') {
    return 'Cross Network';
  }

  const domainName = getDomainName(referringDomain);

  if (isPaidTraffic(utmMedium, anyClickIdPresent)) {
    return (
      typeOrNull(isSearch(utmSource, domainName), 'Paid Search') ??
      typeOrNull(isSocial(utmSource, domainName, utmMedium), 'Paid Social') ??
      typeOrNull(isVideo(utmSource, domainName, utmMedium, utmCampaign), 'Paid Video') ??
      typeOrNull(isShopping(utmSource, domainName, utmCampaign), 'Paid Shopping') ??
      typeOrNull(isDisplay(utmMedium), 'Display') ??
      'Paid Unknown'
    );
  }

  if (isDirectTraffic(referringDomain, utmMedium, utmSource)) {
    return 'Direct';
  }

  return (
    typeOrNull(isSearch(utmSource, domainName), 'Organic Search') ??
    typeOrNull(isSocial(utmSource, domainName, utmMedium), 'Organic Social') ??
    typeOrNull(isVideo(utmSource, domainName, utmMedium, utmCampaign), 'Organic Video') ??
    typeOrNull(isShopping(utmSource, domainName, utmCampaign), 'Organic Shopping') ??
    typeOrNull(isEmail(utmSource, utmMedium), 'Email') ??
    typeOrNull(isSMS(utmSource), 'SMS') ??
    typeOrNull(isPush(utmSource, utmMedium), 'Push') ??
    typeOrNull(isDisplay(utmMedium), 'Display') ??
    typeOrNull(isReferral(utmMedium), 'Referral') ??
    typeOrNull(isAudio(utmMedium), 'Audio') ??
    typeOrNull(isAffiliate(utmMedium), 'Affiliate') ??
    'Unknown'
  );
};

const getDomainName = (domain: string): string => {
  if (domain === null) {
    return domain;
  }
  const parts = domain.split('.');
  return parts.length > 2 ? parts.slice(-2).join('.') : domain;
};

const isPaidTraffic = (utmMedium: string, anyClickIdPresent: boolean) => {
  return (
    ['cpc', 'cpm', 'cpv', 'cpa', 'ppc', 'retargeting'].includes(utmMedium) ||
    utmMedium.startsWith('paid') ||
    anyClickIdPresent
  );
};

const isDirectTraffic = (referringDomain: string, utmMedium: string, utmSource: string) => {
  return (
    referringDomain === '$direct' &&
    utmMedium === null &&
    (utmSource === null || ['(direct)', 'direct'].includes(utmSource))
  );
};

const isSearch = (utmSource: string, domainName: string) => {
  return searchUtmSources.includes(utmSource) || searchReferringDomain.includes(domainName);
};

const isSocial = (utmSource: string, domainName: string, utmMedium: string) => {
  return (
    socialUtmSources.includes(utmSource) ||
    socialReferringDomain.includes(domainName) ||
    socialUtmMediums.includes(utmMedium)
  );
};

const isVideo = (utmSource: string, domainName: string, utmMedium: string, utmCampaign: string) => {
  return (
    videoUtmSources.includes(utmSource) ||
    videoReferringDomain.includes(domainName) ||
    utmMedium === 'video' ||
    (utmCampaign && utmCampaign.match(/^(.*video.*)$/) !== null)
  );
};

const isShopping = (utmSource: string, domainName: string, utmCampaign: string) => {
  return (
    shoppingUtmSources.includes(utmSource) ||
    shoppingReferringDomain.includes(domainName) ||
    (utmCampaign && utmCampaign.match(/^(.*(([^a-df-z]|^)shop|shopping).*)$/) !== null)
  );
};

const isDisplay = (utmMedium: string) => {
  return displayUtmMediums.includes(utmMedium);
};

const isEmail = (utmSource: string, utmMedium: string) => {
  return emailUtmSources.includes(utmSource) || emailUtmMediums.includes(utmMedium);
};

const isPush = (utmSource: string, utmMedium: string) => {
  return (
    utmSource === 'firebase' || pushUtmMediums.includes(utmMedium) || (utmMedium && utmMedium.match(/push$/) !== null)
  );
};

const isSMS = (utmSource: string) => {
  return utmSource === 'sms';
};

const isReferral = (utmMedium: string) => {
  return referralUtmMediums.includes(utmMedium);
};

const isAudio = (utmMedium: string) => {
  return utmMedium === 'audio';
};

const isAffiliate = (utmMedium: string) => {
  return utmMedium === 'affiliate';
};

const typeOrNull = (condition: boolean, channelType: ChannelType): ChannelType | null => {
  return condition ? channelType : null;
};

const searchUtmSources = [
  'alice',
  'aol',
  'ask',
  'auone',
  'avg',
  'babylon',
  'baidu',
  'biglobe',
  'bing',
  'cnn',
  'comcast',
  'conduit',
  'daum',
  'dogpile',
  'duckduckgo',
  'eniro',
  'globo',
  'google',
  'google-play',
  'incredimail',
  'kvasir',
  'lycos',
  'msn',
  'najdi',
  'naver',
  'onet',
  'qwant',
  'rakuten',
  'rambler',
  'search-results',
  'seznam',
  'sogou',
  'startsiden',
  'terra',
  'ukr',
  'virgilio',
  'yahoo',
  'yandex',
];

const searchReferringDomain = [
  '360.cn',
  'search.aol.co.uk',
  'search.aol.com',
  'suche.aol.de',
  'sp-web.search.auone.jp',
  'm.baidu.com',
  'biglobe.co.jp',
  'biglobe.ne.jp',
  'bing.com',
  'cn.bing.com',
  'bing.com.cn',
  'bing.net',
  'bingworld.com',
  'centrum.cz',
  'daum.net',
  'search.smt.docomo.ne.jp',
  'dogpile.com',
  'duckduckgo.com',
  'ecosia.org',
  'exalead.com',
  'excite.com',
  'firmy.cz',
  'google.ad',
  'google.ae',
  'google.al',
  'google.am',
  'google.as',
  'google.at',
  'google.az',
  'google.ba',
  'google.be',
  'google.bf',
  'google.bg',
  'google.bi',
  'google.bj',
  'google.bs',
  'google.bt',
  'google.by',
  'google.ca',
  'google.cat',
  'google.cd',
  'google.cf',
  'google.cg',
  'google.ch',
  'google.ci',
  'google.cl',
  'google.cm',
  'google.cn',
  'google.co.ao',
  'google.co.bw',
  'google.co.ck',
  'google.co.cr',
  'google.co.id',
  'google.co.il',
  'google.co.in',
  'google.co.jp',
  'google.co.ke',
  'google.co.kr',
  'google.co.ls',
  'google.co.ma',
  'google.co.mz',
  'google.co.nz',
  'google.co.th',
  'google.co.tz',
  'google.co.ug',
  'google.co.uk',
  'google.co.uz',
  'google.co.ve',
  'google.co.vi',
  'google.co.za',
  'google.co.zm',
  'google.co.zw',
  'google.com',
  'lens.google.com',
  'news.google.com',
  'play.google.com',
  'search.google.com',
  'google.com.af',
  'google.com.ag',
  'google.com.ar',
  'google.com.au',
  'google.com.bd',
  'google.com.bh',
  'google.com.bn',
  'google.com.bo',
  'google.com.br',
  'google.com.bz',
  'google.com.co',
  'google.com.cu',
  'google.com.cy',
  'google.com.do',
  'google.com.ec',
  'google.com.eg',
  'google.com.et',
  'google.com.fj',
  'google.com.gh',
  'google.com.gi',
  'google.com.gt',
  'google.com.hk',
  'google.com.jm',
  'google.com.kh',
  'google.com.kw',
  'google.com.lb',
  'google.com.ly',
  'google.com.mm',
  'google.com.mt',
  'google.com.mx',
  'google.com.my',
  'google.com.na',
  'google.com.ng',
  'google.com.ni',
  'google.com.np',
  'google.com.om',
  'google.com.pa',
  'google.com.pe',
  'google.com.pg',
  'google.com.ph',
  'google.com.pk',
  'google.com.pr',
  'google.com.py',
  'google.com.qa',
  'google.com.sa',
  'google.com.sb',
  'google.com.sg',
  'google.com.sl',
  'google.com.sv',
  'google.com.tj',
  'google.com.tr',
  'google.com.tw',
  'google.com.ua',
  'google.com.uy',
  'google.com.vc',
  'google.com.vn',
  'google.cv',
  'google.cz',
  'google.de',
  'google.dj',
  'google.dk',
  'google.dm',
  'google.dz',
  'google.ee',
  'google.es',
  'google.fi',
  'google.fm',
  'google.fr',
  'google.ga',
  'google.ge',
  'google.gg',
  'google.gl',
  'google.gm',
  'google.gr',
  'google.gy',
  'google.hn',
  'google.hr',
  'google.ht',
  'google.hu',
  'google.ie',
  'google.im',
  'google.iq',
  'google.is',
  'google.it',
  'google.je',
  'google.jo',
  'google.kg',
  'google.ki',
  'google.kz',
  'google.la',
  'google.li',
  'google.lk',
  'google.lt',
  'google.lu',
  'google.lv',
  'google.md',
  'google.me',
  'google.mg',
  'google.mk',
  'google.ml',
  'google.mn',
  'google.mu',
  'google.mv',
  'google.mw',
  'google.ne',
  'google.nl',
  'google.no',
  'google.nr',
  'google.nu',
  'google.pl',
  'google.pn',
  'google.ps',
  'google.pt',
  'google.ro',
  'google.rs',
  'google.ru',
  'google.rw',
  'google.sc',
  'google.se',
  'google.sh',
  'google.si',
  'google.sk',
  'google.sm',
  'google.sn',
  'google.so',
  'google.sr',
  'google.st',
  'google.td',
  'google.tg',
  'google.tl',
  'google.tm',
  'google.tn',
  'google.to',
  'google.tt',
  'google.vu',
  'google.ws',
  'go.mail.ru',
  'msn.com',
  'ntp.msn.com',
  'm.naver.com',
  'm.search.naver.com',
  'naver.com',
  'onet.pl',
  'lite.qwant.com',
  'qwant.com',
  'rakuten.co.jp',
  'websearch.rakuten.co.jp',
  'mail.rambler.ru',
  'rambler.ru',
  'email.seznam.cz',
  'seznam.cz',
  'so.com',
  'm.sogou.com',
  'sogou.com',
  'wap.sogou.com',
  'startsiden.no',
  'tut.by',
  'search.ukr.net',
  'secureurl.ukr.net',
  'yahoo.co.jp',
  'ar.search.yahoo.com',
  'at.search.yahoo.com',
  'au.search.yahoo.com',
  'br.search.yahoo.com',
  'ca.search.yahoo.com',
  'ch.search.yahoo.com',
  'cl.search.yahoo.com',
  'co.search.yahoo.com',
  'de.search.yahoo.com',
  'dk.search.yahoo.com',
  'es.search.yahoo.com',
  'espanol.search.yahoo.com',
  'fi.search.yahoo.com',
  'fr.search.yahoo.com',
  'hk.search.yahoo.com',
  'id.search.yahoo.com',
  'in.search.yahoo.com',
  'it.search.yahoo.com',
  'malaysia.search.yahoo.com',
  'mx.search.yahoo.com',
  'nl.search.yahoo.com',
  'no.search.yahoo.com',
  'nz.search.yahoo.com',
  'pe.search.yahoo.com',
  'ph.search.yahoo.com',
  'pl.search.yahoo.com',
  'se.search.yahoo.com',
  'sg.search.yahoo.com',
  'th.search.yahoo.com',
  'tr.search.yahoo.com',
  'tw.search.yahoo.com',
  'uk.search.yahoo.com',
  'us.search.yahoo.com',
  'vn.search.yahoo.com',
  'yahoo.com',
  'yandex.by',
  'yandex.com',
  'yandex.com.tr',
  'yandex.fr',
  'yandex.kz',
  'mail.yandex.ru',
  'webmaster.yandex.ru',
  'yandex.ru',
  'zen.yandex.ru',
  'yandex.ua',
  'yandex.uz',
];

const shoppingUtmSources = [
  'domain',
  'IGShopping',
  'alibaba',
  'amazon',
  'ebay',
  'etsy',
  'mercadolibre',
  'shopify',
  'Shopping',
  'shopzilla',
  'stripe',
  'walmart',
];

const shoppingReferringDomain = [
  'alibaba.com',
  'm.alibaba.com',
  'message.alibaba.com',
  'offer.alibaba.com',
  'aax-us-east.amazon-adsystem.com',
  'aax.amazon-adsystem.com',
  'amazon.co.uk',
  'amazon.com',
  'ebay.co.uk',
  'ebay.com',
  'ebay.com.au',
  'ebay.de',
  'etsy.com',
  'mercadolibre.com',
  'mercadolibre.com.ar',
  'mercadolibre.com.mx',
  'cr.shopping.naver.com',
  'cr2.shopping.naver.com',
  'm.shopping.naver.com',
  'msearch.shopping.naver.com',
  'shopping.naver.com',
  's3.amazonaws.com',
  'shop.app',
  'apps.shopify.com',
  'checkout.shopify.com',
  'partners.shopify.com',
  'shopify.com',
  'nl.shopping.net',
  'no.shopping.net',
  'se.shopping.net',
  'uk.shopping.net',
  'shopzilla.com',
  'simplycodes.com',
  'checkout.stripe.com',
  'stripe.com',
  'one.walmart.com',
  'walmart.com',
  'order.shopping.yahoo.co.jp',
  'shopping.yahoo.co.jp',
  'store.shopping.yahoo.co.jp',
  'shopping.yahoo.com',
];

const socialUtmSources = [
  '43things',
  'Hatena',
  'ImageShack',
  'activerain',
  'activeworlds',
  'addthis',
  'alumniclass',
  'americantowns',
  'anobii',
  'answerbag',
  'aolanswers',
  'askubuntu',
  'athlinks',
  'baby-gaga',
  'badoo',
  'bebo',
  'beforeitsnews',
  'bharatstudent',
  'blackplanet',
  'blogger',
  'blogher',
  'bloglines',
  'blogsome',
  'blogspot',
  'blogster',
  'blurtit',
  'brightkite',
  'brizzly',
  'buzzfeed',
  'buzznet',
  'cafemom',
  'camospace',
  'care2',
  'catster',
  'cellufun',
  'chicagonow',
  'classmates',
  'classquest',
  'cocolog-nifty',
  'cozycot',
  'crunchyroll',
  'cyworld',
  'deviantart',
  'dianping',
  'digg',
  'diigo',
  'disqus',
  'dogster',
  'dol2day',
  'doostang',
  'dopplr',
  'douban',
  'drugs-forum',
  'dzone',
  'elftown',
  'extole',
  'facebook',
  'faceparty',
  'fanpop',
  'fark',
  'fb',
  'fc2',
  'feedspot',
  'feministing',
  'filmaffinity',
  'flickr',
  'flipboard',
  'folkdirect',
  'foodservice',
  'fotki',
  'fotolog',
  'foursquare',
  'friendfeed',
  'fubar',
  'gaiaonline',
  'gamerdna',
  'glassboard',
  'glassdoor',
  'godtube',
  'goldstar',
  'gooblog',
  'goodreads',
  'google+',
  'googleplus',
  'govloop',
  'gowalla',
  'habbo',
  'hi5',
  'hootsuite',
  'houzz',
  'hoverspot',
  'hubculture',
  'ibibo',
  'ig',
  'imvu',
  'insanejournal',
  'instagram',
  'instapaper',
  'intherooms',
  'italki',
  'jammerdirect',
  'kakao',
  'kaneva',
  'librarything',
  'line',
  'linkedin',
  'listal',
  'listography',
  'livedoorblog',
  'livejournal',
  'meetup',
  'messenger',
  'mocospace',
  'mouthshut',
  'movabletype',
  'mubi',
  'myheritage',
  'mylife',
  'mymodernmet',
  'myspace',
  'netvibes',
  'newsshowcase',
  'nexopia',
  'niconico',
  'nightlifelink',
  'ning',
  'onstartups',
  'opendiary',
  'photobucket',
  'pinboard',
  'pingsta',
  'pinterest',
  'plurk',
  'posterous',
  'qapacity',
  'quechup',
  'quora',
  'ravelry',
  'reddit',
  'redux',
  'renren',
  'reunion',
  'reverbnation',
  'ryze',
  'salespider',
  'screenrant',
  'scribd',
  'scvngr',
  'secondlife',
  'serverfault',
  'shareit',
  'sharethis',
  'skype',
  'skyrock',
  'snapchat',
  'social',
  'socialvibe',
  'spoke',
  'spruz',
  'stackapps',
  'stackexchange',
  'stackoverflow',
  'stickam',
  'superuser',
  'sweeva',
  'tagged',
  'taggedmail',
  'talkbiznow',
  'techmeme',
  'tencent',
  'tiktok',
  'tinyurl',
  'toolbox',
  'travellerspoint',
  'tripadvisor',
  'trombi',
  'trustpilot',
  'tudou',
  'tuenti',
  'tumblr',
  'tweetdeck',
  'twitter',
  'typepad',
  'vampirefreaks',
  'vampirerave',
  'wakoopa',
  'wattpad',
  'webshots',
  'wechat',
  'weebly',
  'weibo',
  'weread',
  'whatsapp',
  'wordpress',
  'xanga',
  'xing',
  'yammer',
  'yelp',
  'zalo',
  'zooppa',
];

const socialUtmMediums = ['sm', 'social', 'social media', 'social network', 'social-media', 'social-network'];

const socialReferringDomain = [
  '43things.com',
  '51.com',
  '5ch.net',
  'academia.edu',
  'activerain.com',
  'activeworlds.com',
  'addthis.com',
  'airg.ca',
  'allnurses.com',
  'allrecipes.com',
  'alumniclass.com',
  'ameba.jp',
  'ameblo.jp',
  'americantowns.com',
  'ancestry.com',
  'forums.androidcentral.com',
  'anobii.com',
  'answerbag.com',
  'wiki.answers.com',
  'lifestream.aol.com',
  'aolanswers.com',
  'artstation.com',
  'askubuntu.com',
  'asmallworld.com',
  'athlinks.com',
  'awe.sm',
  'baby-gaga.com',
  'babyblog.ru',
  'badoo.com',
  'bebo.com',
  'beforeitsnews.com',
  'bharatstudent.com',
  'biip.no',
  'biswap.org',
  'bit.ly',
  'blackcareernetwork.com',
  'blackplanet.com',
  'blip.fm',
  'blog.com',
  'blogg.no',
  'bloggang.com',
  'blogger.com',
  'draft.blogger.com',
  'blogher.com',
  'bloglines.com',
  'blogs.com',
  'blogsome.com',
  'blogspot.com',
  'blogster.com',
  'blurtit.com',
  'brightkite.com',
  'brizzly.com',
  'buzzfeed.com',
  'buzznet.com',
  'cafemom.com',
  'camospace.com',
  'canalblog.com',
  'care.com',
  'care2.com',
  'caringbridge.org',
  'catster.com',
  'cbnt.io',
  'cellufun.com',
  'centerblog.net',
  'chegg.com',
  'chicagonow.com',
  'classmates.com',
  'classquest.com',
  'cocolog-nifty.com',
  'couchsurfing.org',
  'cozycot.com',
  'forums.crackberry.com',
  'cross.tv',
  'crunchyroll.com',
  'cyworld.com',
  'dailystrength.org',
  'deluxe.com',
  'deviantart.com',
  'dianping.com',
  'digg.com',
  'diigo.com',
  'disqus.com',
  'dogster.com',
  'dol2day.com',
  'doostang.com',
  'dopplr.com',
  'douban.com',
  'draugiem.lv',
  'drugs-forum.com',
  'dzone.com',
  'edublogs.org',
  'elftown.com',
  'epicurious.com',
  'everforo.com',
  'exblog.jp',
  'extole.com',
  'apps.facebook.com',
  'business.facebook.com',
  'facebook.com',
  'free.facebook.com',
  'l.facebook.com',
  'lm.facebook.com',
  'm.facebook.com',
  'mobile.facebook.com',
  'touch.facebook.com',
  'web.facebook.com',
  'faceparty.com',
  'fandom.com',
  'fanpop.com',
  'fark.com',
  'fb.me',
  'fc2.com',
  'blog.feedspot.com',
  'feministing.com',
  'filmaffinity.com',
  'flickr.com',
  'flipboard.com',
  'folkdirect.com',
  'foodservice.com',
  'fotki.com',
  'fotolog.com',
  'foursquare.com',
  'friendfeed.com',
  'fruehstueckstreff.org',
  'fubar.com',
  'gaiaonline.com',
  'gamerdna.com',
  'gather.com',
  'geni.com',
  'getpocket.com',
  'glassboard.com',
  'glassdoor.com',
  'godtube.com',
  'goldenline.pl',
  'goldstar.com',
  'goo.gl',
  'blog.goo.ne.jp',
  'oshiete.goo.ne.jp',
  'goodreads.com',
  'groups.google.com',
  'messages.google.com',
  'plus.google.com',
  'plus.url.google.com',
  'sites.google.com',
  'googlegroups.com',
  'govloop.com',
  'gowalla.com',
  'gree.jp',
  'gulli.com',
  'gutefrage.net',
  'habbo.com',
  'b.hatena.ne.jp',
  'd.hatena.ne.jp',
  'hi5.com',
  'pro.homeadvisor.com',
  'hootsuite.com',
  'houzz.com',
  'hoverspot.com',
  'hr.com',
  'hubculture.com',
  'discover.hubpages.com',
  'hubpages.com',
  'hyves.net',
  'hyves.nl',
  'ibibo.com',
  'video.ibm.com',
  'identi.ca',
  'imageshack.com',
  'imageshack.us',
  'forums.imore.com',
  'imvu.com',
  'insanejournal.com',
  'instagram.com',
  'l.instagram.com',
  'instapaper.com',
  'internations.org',
  'interpals.net',
  'intherooms.com',
  'irc-galleria.net',
  'is.gd',
  'italki.com',
  'jammerdirect.com',
  'jappy.com',
  'jappy.de',
  'kaboodle.com',
  'kakao.com',
  'kakaocorp.com',
  'kaneva.com',
  'last.fm',
  'librarything.com',
  'line.me',
  'linkedin.com',
  'copainsdavant.linternaute.com',
  'listal.com',
  'listography.com',
  'spaces.live.com',
  'livedoor.com',
  'livejournal.com',
  'lnkd.in',
  'mbga.jp',
  'medium.com',
  'meetin.org',
  'meetup.com',
  'meinvz.net',
  'meneame.net',
  'menuism.com',
  'l.messenger.com',
  'messenger.com',
  'mix.com',
  'mixi.jp',
  'mocospace.com',
  'mouthshut.com',
  'movabletype.com',
  'mubi.com',
  'myanimelist.net',
  'myheritage.com',
  'mylife.com',
  'mymodernmet.com',
  'myspace.com',
  'blog.naver.com',
  'cafe.naver.com',
  'kin.naver.com',
  'm.blog.naver.com',
  'm.cafe.naver.com',
  'm.kin.naver.com',
  'netvibes.com',
  'forums.nexopia.com',
  'ngopost.org',
  'nicovideo.jp',
  'nightlifelink.com',
  'ning.com',
  'odnoklassniki.ru',
  'odnoklassniki.ua',
  'okwave.jp',
  'oneworldgroup.org',
  'onstartups.com',
  'opendiary.com',
  'my.opera.com',
  'over-blog.com',
  'overblog.com',
  'paper.li',
  'partyflock.nl',
  'photobucket.com',
  'pinboard.in',
  'pingsta.com',
  'pinterest.at',
  'pinterest.ca',
  'pinterest.ch',
  'pinterest.cl',
  'pinterest.co.kr',
  'pinterest.co.uk',
  'ar.pinterest.com',
  'br.pinterest.com',
  'co.pinterest.com',
  'cz.pinterest.com',
  'hu.pinterest.com',
  'id.pinterest.com',
  'in.pinterest.com',
  'nl.pinterest.com',
  'pinterest.com',
  'pl.pinterest.com',
  'tr.pinterest.com',
  'za.pinterest.com',
  'pinterest.com.au',
  'pinterest.com.mx',
  'pinterest.de',
  'pinterest.es',
  'pinterest.fr',
  'pinterest.it',
  'pinterest.jp',
  'pinterest.nz',
  'pinterest.ph',
  'pinterest.pt',
  'pinterest.ru',
  'pinterest.se',
  'pixiv.net',
  'playahead.se',
  'plurk.com',
  'pocket.co',
  'posterous.com',
  'qapacity.com',
  'qzone.qq.com',
  'quechup.com',
  'quora.com',
  'ravelry.com',
  'amp.reddit.com',
  'old.reddit.com',
  'out.reddit.com',
  'reddit.com',
  'redux.com',
  'renren.com',
  'researchgate.net',
  'reunion.com',
  'reverbnation.com',
  'rtl.de',
  'ryze.com',
  'salespider.com',
  'scoop.it',
  'screenrant.com',
  'scribd.com',
  'scvngr.com',
  'secondlife.com',
  'serverfault.com',
  'sharethis.com',
  'shvoong.com',
  'web.skype.com',
  'skyrock.com',
  'slashdot.org',
  'slideshare.net',
  'smartnews.com',
  'snapchat.com',
  'sociallife.com.br',
  'socialvibe.com',
  'spoke.com',
  'spruz.com',
  'ssense.com',
  'stackapps.com',
  'stackexchange.com',
  'stackoverflow.com',
  'stardoll.com',
  'stickam.com',
  'studivz.net',
  'suomi24.fi',
  'superuser.com',
  'sweeva.com',
  't.co',
  't.me',
  'tagged.com',
  'taggedmail.com',
  'talkbiznow.com',
  'taringa.net',
  'techmeme.com',
  'tencent.com',
  'tiktok.com',
  'tinyurl.com',
  'toolbox.com',
  'travellerspoint.com',
  'tripadvisor.com',
  'trombi.com',
  'tudou.com',
  'tuenti.com',
  'tumblr.com',
  'tweetdeck.com',
  'twitter.com',
  'twoo.com',
  'typepad.com',
  'unblog.fr',
  'urbanspoon.com',
  'ushareit.com',
  'ushi.cn',
  'vampirefreaks.com',
  'vampirerave.com',
  'vg.no',
  'away.vk.com',
  'm.vk.com',
  'vk.com',
  'vkontakte.ru',
  'wakoopa.com',
  'wattpad.com',
  'forums.webosnation.com',
  'webshots.com',
  'wechat.com',
  'weebly.com',
  'weibo.com',
  'wer-weiss-was.de',
  'weread.com',
  'whatsapp.com',
  'wikihow.com',
  'wikitravel.org',
  'woot.com',
  'wordpress.com',
  'wordpress.org',
  'forums.wpcentral.com',
  'xanga.com',
  'xing.com',
  'yahoo-mbga.jp',
  'blog.yahoo.co.jp',
  'bookmarks.yahoo.co.jp',
  'chiebukuro.yahoo.co.jp',
  'messages.yahoo.co.jp',
  'answers.yahoo.com',
  'bookmarks.yahoo.com',
  'pulse.yahoo.com',
  'yammer.com',
  'news.ycombinator.com',
  'yelp.co.uk',
  'm.yelp.com',
  'yelp.com',
  'youroom.in',
  'chat.zalo.me',
  'zoo.gr',
  'zooppa.com',
];

const videoUtmSources = [
  'crackle',
  'curiositystream',
  'dailymotion',
  'disneyplus',
  'hulu',
  'iqiyi',
  'netflix',
  'ted',
  'twitch',
  'utreon',
  'veoh',
  'vimeo',
  'wistia',
  'youku',
  'youtube',
];

const videoReferringDomain = [
  'crackle.com',
  'curiositystream.com',
  'd.tube',
  'dailymotion.com',
  'disneyplus.com',
  'help.hulu.com',
  'hulu.com',
  'iq.com',
  'iqiyi.com',
  'viadeo.journaldunet.com',
  'justin.tv',
  'help.netflix.com',
  'jobs.netflix.com',
  'netflix.com',
  'ted.com',
  'blog.twitch.tv',
  'dashboard.twitch.tv',
  'id.twitch.tv',
  'm.twitch.tv',
  'player.twitch.tv',
  'twitch.tv',
  'utreon.com',
  'veoh.com',
  'player.vimeo.com',
  'vimeo.com',
  'wistia.com',
  'fast.wistia.net',
  'youku.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube.com',
];

const emailUtmSources = ['e mail', 'e-mail', 'e_mail', 'email'];
const emailUtmMediums = ['e mail', 'e-mail', 'e_mail', 'email'];
const pushUtmMediums = ['mobile', 'notification', 'push'];
const displayUtmMediums = ['banner', 'cpm', 'display', 'expandable', 'interstitial'];
const referralUtmMediums = ['app', 'link', 'referral'];
