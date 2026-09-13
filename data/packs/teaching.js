/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : TEACHING SCRIPT PACK
   ------------------------------------------------------------------
   The guided walkthrough (Teaching mode). Each step: title, nodes
   (ids to highlight; empty = whole map), tag, body, callout.
   Step count and progress bar follow this array automatically.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.teaching = {
  meta: { pack:'teaching', stepCount:22 },
  series: 'Wizard Spider & Conti: A Real Attack',
  tag: 'Wizard Spider / Conti',
  steps: [
    {
      title: 'What is Ransomware?',
      nodes: [],
      tag: 'Introduction',
      body: 'Ransomware is malicious software that encrypts a victim\'s files, making them completely inaccessible, and demands a ransom payment in exchange for the decryption key. A ransomware attack can halt a hospital\'s patient systems, lock a manufacturer\'s production lines, or freeze a law firm\'s case files within minutes. Through July 2026 alone, tracking platforms recorded more than 5,400 victim organisations named publicly this year across 132 countries, with 115 distinct groups active. On-chain ransom payments totalled roughly $820 million in 2025, and the share of victims who pay fell to an all-time low of 28 percent. Many more incidents go unreported.',
      callout: 'The map behind this panel shows the full ecosystem that makes ransomware possible. It is not one criminal and one computer. It is an industrialised supply chain with specialised roles, commercial markets, western commercial permission, and state protection. This walkthrough explains every part of it.'
    },
    {
      title: 'Why Ransomware is So Profitable',
      nodes: ['mixers','otc','exchl','mules'],
      tag: 'Introduction',
      body: 'Ransomware succeeds because it industrialised extortion. Criminal groups buy access to victim networks, rent infrastructure, hire affiliate teams, and use specialist financial services to convert ransom payments into usable cash. The model has now bifurcated. In the second quarter of 2026 the average ransom payment reached $1.88 million, up 176 percent in a single quarter, while the median fell to $150,000 and the overall payment rate hit a record low. The ecosystem is extracting far more money from far fewer payers. Ransom payments still flow through cryptocurrency channels that cross borders instantly, are difficult to trace, and harder still to seize.',
      callout: 'The right side of the map, highlighted now, is where the money flows after a ransom is paid. Concentration into a small number of very large payments is a weakness, not a strength: a handful of traceable nine-figure transactions is a far more tractable enforcement surface than thousands of small ones.'
    },
    {
      title: 'The Group Behind This Story',
      nodes: [],
      tag: 'Meet Wizard Spider',
      body: 'Wizard Spider is a Russian-speaking criminal organisation operating since approximately 2016, based in St. Petersburg. The group built and operated TrickBot, one of the most sophisticated malware platforms ever created, before developing the Ryuk and then Conti ransomware brands. It operated like a corporation: internal job titles, salary structures, HR processes, and performance reviews. In July 2026 the European Union publicly identified its most senior administrator, known internally only as Stern, as Vitaly Nikolayevich Kovalev, whose wallets received more than $300 million as his personal share alone. That is the first time any sanctioning body has tied the moniker to a name, and it brings the total sanctioned Trickbot members to nineteen. Every step in this walkthrough traces how a real Conti attack worked.',
      callout: 'Wizard Spider is unusually well-documented because an insider published the group\'s internal chats in 2022. The full archive parses to more than 164,000 Jabber messages spanning June 2020 to February 2022, plus roughly 88,000 messages from a second internal chat system. Inside those logs, staff address Stern directly as chief. Most ransomware groups remain far more opaque; the structural dynamics shown here apply across the ecosystem, not just to this one group.'
    },
    {
      title: 'Meet the Target',
      nodes: [],
      victimHighlight: true,
      tag: 'Starting point',
      body: 'Every ransomware attack begins with a target: a hospital, law firm, manufacturer, or government agency. They have valuable data, critical operations, and often insufficient defenses. Wizard Spider deliberately selected high-value organisations that could afford large ransoms and could not afford downtime. Healthcare was a favourite, because patient care pressure meant faster payment decisions. Target selection is now visibly migrating. Across the first half of 2026, attacks on direct-care providers were nearly flat at plus 3.3 percent, while attacks on the businesses behind them, meaning pharmaceutical and device manufacturers, billing providers and health-technology firms, rose 34.7 percent. Device retailers and drug wholesalers rose 67 percent.',
      callout: 'The Victim Orgs box sits to the far left of the map. Every node on this map exists, directly or indirectly, to exploit organisations like this. The migration away from patient-facing targets and toward their suppliers is a deliberate political calculation: comparable data, less law-enforcement and regulatory attention.'
    },
    {
      title: 'Step 1: Getting In',
      nodes: ['loaders'],
      tag: 'Access Generation layer',
      body: 'Wizard Spider built TrickBot, one of the most sophisticated loader botnets ever created, as their primary entry weapon. A phishing email, a malicious download, or a compromised website delivers the loader silently to the victim machine. It installs itself, establishes persistence across reboots, and begins quietly mapping the network. The victim has no idea they are compromised. The delivery technique has since changed more than the model has: the most heavily reported entry method of 2026 is paste-and-run social engineering, where the user is shown a fake error or verification page and instructed to paste a command into their own computer. No vulnerability is exploited, so patching does not close the path.',
      callout: 'Loaders and Botnets are the delivery mechanism for everything downstream. Wizard Spider owned TrickBot outright. Most ransomware groups rent access. That vertical control made them significantly harder to disrupt than affiliate-dependent groups, which is why the modern ecosystem is more fragile at this layer than Conti was.'
    },
    {
      title: 'The Infrastructure Behind the Loader',
      nodes: ['bph'],
      tag: 'Infrastructure layer',
      body: 'The loader needs servers to communicate with, its command-and-control infrastructure. These are hosted by Bulletproof Hosting providers: companies that accept criminal clients, ignore abuse complaints, and resist law enforcement takedown requests. Media Land, headquartered in St. Petersburg, is the current worked example. It has served LockBit, EvilCorp, BlackSuit, Play and Black Basta since 2016, and in eight months it absorbed a US designation, an EU designation, an unsealed US indictment alleging $62 million in victim losses, and a $10 million reward offer for its owner. It remained reachable throughout. Without a hosting layer, this infrastructure collapses; the question the next step answers is why it did not.',
      callout: 'Bulletproof Hosting is the foundation of the entire map. It sits furthest left because virtually everything else depends on it. Three actions against the same company inside eight months, with no interruption of service, is the clearest available demonstration that designating a hosting company is not the same as removing its servers from the internet.'
    },
    {
      title: 'Who Actually Keeps It Online: The Permission Layer',
      nodes: ['enab-transit','enab-registry','enab-corp','bph'],
      tag: 'Permission layer',
      body: 'A bulletproof host owns servers. It does not own the things that make those servers reachable. Every provider depends on a chain of ordinary commercial services: a transit carrier that announces its routes to the rest of the internet, a registry that issues its IP addresses and network numbers, a formation agent that supplies the company on paper, and a payment processor. Almost every firm in that chain is lawful, frequently European, and under no legal obligation to look at what its customer is doing. Five of the seven bulletproof hosts profiled on this site sit behind a Western upstream carrier. One upstream network carries more than a dozen distinct threat enablers. No regional internet registry has ever revoked address space over sanctions, and after one provider was designated, roughly half its address space was reallocated within about twenty four hours.',
      callout: 'Permission and protection are two different mechanisms, and confusing them wastes effort. Russian tolerance explains why these operators are not arrested. Western intermediary law explains why their servers stay online. The last full de-peering of a bulletproof host by its upstream carrier was in 2008. Transit is the only dependency whose removal is instant, comprehensive, and simultaneous across every service a host carries.'
    },
    {
      title: 'Step 2: Stealing Credentials',
      nodes: ['stealers','loaders'],
      tag: 'Access Generation layer',
      body: 'Once inside, the loader deploys a credential stealer: malware that silently harvests passwords, session tokens, and saved logins from the infected machine. A loader is malware whose job is to deliver other malware. A botnet is a network of infected machines all reporting to criminal infrastructure. A log market is an underground store where harvested credential packages are bought and sold. Wizard Spider combined all four. The scale of that harvest is now industrial: a single coordinated operation in June 2026 took down 326 servers and 142 domains and recovered roughly 27 million stolen credentials from more than 385,000 compromised systems. Modern stealers prioritise live session tokens over passwords, because a stolen token bypasses multi-factor authentication entirely.',
      callout: 'Loaders and stealers travel together, and the flood of stolen credentials they produce sets the price of everything downstream. The remediation implication is specific and often missed: after a stealer infection, revoking session tokens matters more than resetting passwords.'
    },
    {
      title: 'The Criminal Marketplace',
      nodes: ['forums'],
      tag: 'Infrastructure layer',
      body: 'Russian-language underground forums function simultaneously as a marketplace, hiring platform, reputation system, and dispute court for the criminal ecosystem. Wizard Spider recruited affiliates there, purchased specialist services, and maintained their standing. For most of the last decade these forums operated with near-impunity. That changed. XSS was actioned in July 2025 with the arrest of its administrator; RAMP was seized in January 2026 and has stayed dark for more than 184 days, with its administrator publicly declining to rebuild; LeakBase has not returned either. The coordination layer is currently the only part of this map where disruption has held.',
      callout: 'When the Conti internal chats leaked in February 2022, it was forum trust that collapsed first. Operators who had been named could no longer vouch for each other. Trust infrastructure is the forums\' real value and their real vulnerability, and the sustained darkness of RAMP and XSS is the strongest evidence on this map that a well-chosen target does not simply grow back.'
    },
    {
      title: 'Selling Access: The Broker Layer',
      nodes: ['iab','stealers'],
      tag: 'Access Markets layer',
      body: 'Not every intrusion gets used directly. Initial Access Brokers buy validated network footholds and resell them to ransomware groups. The economics have shifted sharply. The average price of corporate access fell from roughly $1,427 in early 2023 to about $439 in early 2026, a 69 percent collapse driven by automated access pipelines and the flood of infostealer logs. Validated, high-value access still commands a premium, so the market is bifurcated rather than uniformly cheap. The return ratio remains extraordinary: brokers received at least $14 million on-chain in 2025 against roughly $820 million in ransomware payments, close to 58 to 1.',
      callout: 'Brokers industrialised ransomware by creating a liquid market for intrusions. They also created a measurable tell. Spikes in money flowing to brokers precede rises in ransom payments and victim leak-site posts by roughly thirty days, which makes this the single most useful leading indicator available to defenders and enforcement planners.'
    },
    {
      title: 'The Franchise: Operators and Affiliates',
      nodes: ['raas','affiliate'],
      tag: 'Core Operations layer',
      body: 'Conti operated as a franchise. The operator built and maintained the ransomware code, the admin panel, the negotiation portal, and the leak site infrastructure. Affiliate teams, hired through forums and carefully vetted, conducted the actual intrusions for a revenue split, historically around 70/30. At its peak Conti had over 100 active affiliates working simultaneously. The model has since fragmented: 115 distinct groups were active across the first seven months of 2026, and roughly half the names on any given month\'s top-fifteen list were absent the month before. In June 2026 the top position changed hands not because of enforcement or better tooling, but because a competing brand offered affiliates a 90/10 split after a payout dispute.',
      callout: 'The franchise model is the core reason ransomware is so resilient. Destroying a brand does not destroy the affiliates, it relocates them. Nothing that targets the platforms changes affiliate expected value, which is why the leverage in this part of the map sits in the payment layer rather than the brand.'
    },
    {
      title: 'Moving Through the Network',
      nodes: ['affiliate'],
      tag: 'Core Operations layer',
      body: 'Once inside, Conti affiliates spent one to three weeks moving laterally through the victim network, a phase called dwell time. They located domain controllers, destroyed backup systems, and mapped the most sensitive data before triggering encryption. From initial infection to ransom demand, a typical Conti attack took two to four weeks; the encryption itself completed in under an hour. In July 2026 researchers documented the first known end-to-end intrusion run by an autonomous software agent rather than a human operator. It harvested credentials, moved laterally, encrypted 1,342 configuration items, dropped production databases, and at one point diagnosed and repaired its own failed login in 31 seconds.',
      callout: 'The dwell period is the single best detection window defenders have, and it is narrowing. A response process designed around a two-week human intrusion does not fit an intrusion that completes its decision loop in seconds. Most victims still discover the breach only when files begin encrypting.'
    },
    {
      title: 'Encryption: The Moment of Impact',
      nodes: ['raas','affiliate'],
      tag: 'Core Operations layer',
      body: 'When the affiliate team was ready, Conti ransomware deployed simultaneously across hundreds or thousands of systems. Files encrypted. Operations halted. For a hospital, patient records become inaccessible. For a manufacturer, production lines stop. For a law firm, decades of client files vanish. The attack that had been invisible for weeks becomes impossible to ignore within minutes. Conti was engineered for speed: full network encryption could complete in under an hour. Despite the rise of theft-only extortion, encryption remains the primary pressure method across the ecosystem, and the largest current groups pair encryption with data theft rather than abandoning it.',
      callout: 'Speed was a deliberate design goal. The faster encryption completes, the narrower the window for incident response teams to interrupt the process. Conti prioritised coverage and velocity over stealth at this final stage.'
    },
    {
      title: 'Double Extortion: The Leak Site',
      nodes: ['leaksite'],
      tag: 'Extortion layer',
      body: 'Before encrypting, affiliates steal sensitive data. The leak site then publishes victim names with a countdown clock: pay or confidential data goes public. For a healthcare provider that means patient records; for a law firm, privileged communications; for a listed company, pre-disclosure financial data. Double extortion doubled the leverage and meant organisations with good backups still had reasons to pay. Theft without encryption, however, converts poorly. In the second quarter of 2026 only 15 percent of theft-only victims paid, a historically low figure. Data theft alone leaves the victim a recovery path that does not require the attacker, so the only remaining leverage is reputational, and reputational leverage converts to payment far less reliably than operational paralysis.',
      callout: 'The leak site is the enforcement mechanism of double extortion. The 15 percent figure is the first hard evidence that the encryption-free model carries a structural monetisation penalty, which suggests volume-driven groups will partially revert to encryption while theft-only consolidates among actors targeting heavily regulated data.'
    },
    {
      title: 'The Negotiation',
      nodes: ['negot','leaksite'],
      tag: 'Extortion layer',
      body: 'Conti ran a dedicated negotiation team working from scripts, discount policies, and escalation procedures, effectively a customer service operation for extortion. On the victim side, professional negotiation support consistently produces better outcomes, and overall payment rates have fallen substantially since 2021 as defenses, insurance practice and advisory quality improved. That layer has now been shown to be corruptible. In July 2026 a negotiator at a US incident response firm was sentenced to 70 months for selling clients\' insurance limits and negotiation strategy to the attackers across five cases, with $10 million in assets seized from him.',
      callout: 'Scaling professional negotiation support remains the largest disruption opportunity that requires no access to Russian infrastructure. It now comes with a condition attached: this layer is domestic, licensed and reachable, which makes it both the easiest part of the ecosystem for a Western government to regulate and the part that has already been penetrated. Vetting, licensing, and mandatory disclosure of any prior contact between negotiator and attacker are the obvious controls.'
    },
    {
      title: 'Cleaning the Money: Mixers',
      nodes: ['mixers'],
      tag: 'Financial Obfuscation layer',
      body: 'Ransom paid in Bitcoin is traceable on the public blockchain. Before cashing out, operators route proceeds through cryptocurrency mixers, services that blend transactions from many sources to obscure origin. Chipmixer processed over $3 billion in criminal proceeds before its 2023 seizure, and a European laundering service dismantled in June 2026 had moved roughly EUR 336 million. After every mixer takedown the ecosystem adapts: new services, cross-chain bridges, privacy coins. Total on-chain ransomware payments fell to about $820 million in 2025, down 8 percent, even as claimed attacks rose by half.',
      callout: 'Falling totals are real but the cause is contested, and the honest position is that at least two mechanisms are operating at once. Better defenses and firmer refusal to pay suppress payments; so does enforcement pressure on the laundering layer. Both are consistent with the same numbers, which is why this map treats the decline as real and its cause as unsettled.'
    },
    {
      title: 'Converting to Cash',
      nodes: ['otc','exchl','ruexch'],
      tag: 'Cash-Out layer',
      body: 'Partially obfuscated cryptocurrency flows to brokers and high-risk exchanges, the conversion layer where crypto becomes spendable currency. The front-ends churn constantly: SUEX in 2021, Chatex in 2021, Cryptex in 2024, Garantex seized in March 2025, its successor Grinex dark by April 2026, with trading concentrating onto further successors. Underneath all of them sits something that did not churn. A ruble-backed settlement token issued by a Moscow payments firm carried the customer balances straight from one seized exchange into its successor, and has cleared more than $100 billion in reported turnover. The visible brand changed five times; the rail beneath it ran continuously.',
      callout: 'This remains the highest-priority disruption target on the map, but the target is the settlement layer, not the shopfront. Designating exchange after exchange while the rail underneath keeps clearing is the clearest example on this map of pressure applied one level too high.'
    },
    {
      title: 'The One Lever That Worked in 24 Hours',
      nodes: ['cex','exchl','mixers'],
      tag: 'Financial chokepoint',
      body: 'In mid-July 2026 the US Treasury designated four cryptocurrency addresses that had received $165 million in stablecoins. The company that issues the stablecoin froze $131 million of the balance immediately, taking cumulative freezes against that address set to nearly $475 million. Nothing was seized, no server was taken, no arrest was made, and no foreign government had to cooperate. The value simply stopped being spendable. Every other node on this map substitutes when disrupted: hosting re-registers, proxies resell, stealers rebuild, affiliates migrate. The payment layer cannot substitute, because it is the only point in the chain that must touch the regulated financial system to convert extortion into money.',
      callout: 'The method is proven and the target set is already public. The wallet clusters behind Stern\'s $300 million personal share were published as part of his designation. Applying the same designate-then-freeze sequence to ransomware-attributed clusters requires no new investigation and no foreign cooperation, which makes it the highest expected-value action currently available.'
    },
    {
      title: 'Into the Real Economy: Mule Networks',
      nodes: ['mules'],
      tag: 'Fiat Integration layer',
      body: 'Fiat currency enters the real economy through networks of money mules, individuals who receive transfers and forward them, often recruited through fake job postings. Many do not know they are committing a crime. Financial operators use shell companies, real estate and luxury goods to integrate proceeds, and more than half of mule-linked funds exit within an hour of arrival. The layer is large enough to be attacked directly: a coordinated international operation reported in July 2026 intercepted $293 million and blocked 31,014 bank accounts, and a separate 2026 takedown exposed a single network of more than 6,000 accounts opened with real identity documents.',
      callout: 'Once proceeds reach the real economy, recovery becomes extremely difficult without domestic Russian cooperation, which is structurally unavailable. This is why upstream financial disruption beats attempting to claw funds back at the final stage.'
    },
    {
      title: 'Why They Operated Freely: State Protection',
      nodes: ['fsb','mvd','raas'],
      tag: 'Russian State lane',
      body: 'Wizard Spider operated from Russia with near-impunity. The FSB tolerates ransomware operators through a protection model called krysha, meaning roof: informal shielding in exchange for avoiding Russian targets and occasionally serving the state. That protection can now be measured rather than asserted. When the West issued an arrest warrant, the target was caught 21 times out of 23 in cooperating countries, and 2 times out of 42 against residents of Russia and Belarus. Not one was arrested inside Russia itself: the only two were caught after they traveled abroad. Same warrants, different airport.',
      callout: 'The safe harbour is selective, not absent. Russia\'s own interior ministry reports roughly seven to eight cybercrime detentions a week, and has held the leadership of one hosting provider in pretrial detention for fifteen months, for hosting a drug market that served Russians. What it does not police is ransomware against foreign victims. The variable is victim nationality and domestic political salience, not capability or will.'
    },
    {
      title: 'How Fast It Heals',
      nodes: ['bph','loaders','stealers','forums','ruexch'],
      tag: 'Reconstitution',
      body: 'Reconstitution can be timed. Measuring the interval between a public action and a dated, citable artifact showing that customers had moved to a replacement gives a median of about three days across the closed cases in the current dataset. Several intervals are zero: service was never meaningfully interrupted at all. But not every clock closes. Twelve targets, including two major forums, a leak market, a bulletproof hosting group and several sanctioned exchanges, show no observed reconstitution at all, and their clocks are still running as lower bounds. The pattern that separates the two groups is consistent: infrastructure and brands substitute almost immediately, while trust and coordination structures do not.',
      callout: 'This is the dividing line the rest of the map keeps arriving at from different directions. Actions against things that can be re-bought are absorbed in days. Actions against things that must be re-earned, meaning reputation, trust relationships, and the ability to convert value into money, are the ones still holding months later.'
    },
    {
      title: 'The Collapse, and What Came After',
      nodes: ['raas','forums','affiliate'],
      caseStudy: 'conti',
      tag: 'Case Study: Conti Collapse 2022',
      body: 'In February 2022 Wizard Spider publicly backed Russia\'s invasion of Ukraine. An insider responded by publishing the group\'s internal chats, exposing personnel, financial flows, protection relationships and internal disputes, and the archive shows the crew splitting along national lines in real time. Within 90 days the Conti brand dissolved. The people did not. Former members formed Black Basta, Royal, Quantum and others, and code and personnel continuity runs forward from there into brands still operating in 2026. Four years later, the most senior figure in the group was publicly named for the first time, while remaining beyond any Western jurisdiction\'s reach.',
      callout: 'The lesson holds and is now measurable. Brand takedowns do not destroy ecosystems. What matters is the durable structure underneath: trust infrastructure, financial rails, specialist skills, and protection relationships. Where those survive, new brands appear within weeks. Where they are the target, as with the forums and the payment layer, disruption has actually held. This map exists to show which is which.'
    }
  ]
};
