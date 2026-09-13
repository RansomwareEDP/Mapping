/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : CASE STUDIES PACK
   ------------------------------------------------------------------
   The Stories menu. Each case: id, label, year, type, summary,
   lesson, effects (node id to {level, note}). Levels: FULL,
   SIGNIFICANT, PARTIAL, MODERATE, LIMITED. A case study button is
   generated for every entry here; add a case, get a button.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.cases = {
  meta: { pack:'cases', caseCount:6 },
  cases: [
    {
      id: 'conti',
      label: 'Conti Collapse',
      year: '2022',
      type: 'Internal Leak',
      summary: 'Internal political leak exposed 60,000+ chat messages, source code, financial flows, and protection relationships. Brand dissolved within 90 days. Five or more successor brands emerged within 60 days but never approached Conti scale individually.',
      lesson: 'Trust infrastructure (Node 07) was the critical variable. Reconstitution failed not because capacity was destroyed but because mutual trust was. Successor emergence was rapid but fragmented.',
      effects: {
        raas: {
          level: 'FULL',
          note: 'Brand dissolved within 90 days. Leadership vacuum filled by splinter brands. Black Basta emerged within 60 days staffed by confirmed former Conti operators.'
        },
        forums: {
          level: 'FULL',
          note: 'Financial records, personnel identities, and dispute history exposed. Forum trust in Conti-linked actors collapsed across Exploit and XSS. Multiple former members unable to establish new working relationships due to exposure risk.'
        },
        otc: {
          level: 'PARTIAL',
          note: 'Flows dropped at attributed OTC nodes post-collapse. Some brokers subsequently served successor brands, indicating infrastructure persistence.'
        },
        iab: {
          level: 'MODERATE',
          note: 'Former affiliates re-entered IAB markets as buyers, temporarily increasing demand in the 30-60 day window post-collapse.'
        },
        mules: {
          level: 'LIMITED',
          note: 'Laundering infrastructure largely persisted through successor brand relationships. Limited observable disruption.'
        },
        fsb: {
          level: 'PARTIAL',
          note: 'Leaked chats exposed protection relationships and krysha-adjacent financial flows. FSB distanced from named actors as domestic liability risk rose. Some actors who were named in leaks lost operational protection within 90 days.'
        },
        mvd: {
          level: 'MODERATE',
          note: 'MVD Department K opened files on several exposed actors using the leaked chat content as probable-cause basis. Outcomes not publicly confirmed but forum reconstitution delays are consistent with active domestic scrutiny.'
        }
      }
    },
    {
      id: 'lockbit',
      label: 'LockBit / Cronos',
      year: '2024',
      type: 'Coordinated Takedown + Arrests',
      summary: 'NCA-led coordinated operation seized infrastructure, took control of the leak site, arrested two operators, and unsealed indictments. LockBit relaunched in approximately 5 days but at significantly reduced volume. RansomHub rapidly absorbed displaced affiliates.',
      lesson: 'Fast relaunch (5 days) reflects absent simultaneous financial rail disruption. LE reuse of the seized leak site for operational messaging was a high-value trust cascade action. Successor brand pre-positioning (RansomHub) should be a required planning element before any major brand-level takedown.',
      effects: {
        leaksite: {
          level: 'FULL',
          note: 'Infrastructure seized and reused for LE operational messaging: affiliate identities, decryption keys, and internal data published on the seized site. High-value trust cascade action beyond simple takedown.'
        },
        forums: {
          level: 'SIGNIFICANT',
          note: 'Affiliate-level trust breakdown. Forum users could not be certain what data had been compromised. Dispute threads spiked in the 30-60 day window.'
        },
        raas: {
          level: 'PARTIAL',
          note: 'Relaunched in approximately 5 days. Post-relaunch volume: 40% at 30 days, 65-70% at 90 days. Fast relaunch reflects intact BPH and absent financial rail pressure.'
        },
        iab: {
          level: 'MODERATE',
          note: 'LockBit affiliate purchasing patterns showed temporary reduction. Former affiliates migrated to competing franchises within 60-90 days.'
        },
        otc: {
          level: 'LIMITED',
          note: 'Financial rails were not simultaneously disrupted. OTC brokers serving LockBit were not targeted in the operation, enabling rapid infrastructure reconstitution.'
        },
        fsb: {
          level: 'LIMITED',
          note: 'No observable change in FSB protection posture toward LockBit core. Fast relaunch (5 days) is consistent with intact protection. Indictments unsealed against non-Russian nationals only, consistent with FSB shielding of domestically resident operators.'
        },
        mvd: {
          level: 'LIMITED',
          note: 'No confirmed MVD action against LockBit-linked actors post-Cronos. The absence of domestic enforcement despite the scale of the operation is a structural indicator of active protection for core operators.'
        }
      }
    },
    {
      id: 'blackcat',
      label: 'BlackCat / ALPHV',
      year: '2024',
      type: 'Takedown + Exit Scam',
      summary: 'DOJ disrupted BlackCat infrastructure in December 2023. BlackCat regained control within 48-72 hours. In March 2024, following the approximately $22M Change Healthcare payment, administrators disappeared with affiliate proceeds in what was widely assessed as an exit scam with intent to rebrand.',
      lesson: 'Two events in sequence produced a higher ecosystem effect than either would have alone. LE disruption created instability; exit scam destroyed remaining trust. Exit scams are predictable under certain conditions: large payment received, LE pressure active, administrators facing personal exposure.',
      effects: {
        raas: {
          level: 'FULL',
          note: 'Brand collapsed after exit scam. Exit scam followed LE disruption, a compounding effect: disruption created instability, exit scam destroyed the remaining trust. RansomHub absorbed former affiliates within 60 days.'
        },
        forums: {
          level: 'FULL',
          note: 'Exit scam destroyed residual trust. Affiliates publicly complained on Exploit and XSS confirming non-payment of shares from the Change Healthcare ransom.'
        },
        affiliate: {
          level: 'FULL',
          note: 'Affiliates not paid from the approximately $22M Change Healthcare ransom. Public forum complaints confirmed non-payment and accelerated brand collapse.'
        },
        leaksite: {
          level: 'PARTIAL',
          note: 'Seized but recaptured by BlackCat within 48-72 hours. Fast relaunch reflected intact BPH relationships and low reconstitution cost at the infrastructure level.'
        },
        fsb: {
          level: 'MODERATE',
          note: 'Exit scam behavior following LE disruption is consistent with a protection relationship under strain. Administrators fleeing with affiliate proceeds rather than reconstituting under FSB cover suggests either no active protection or that protection was being withdrawn due to the Change Healthcare political exposure.'
        }
      }
    },
    {
      id: 'endgame',
      label: 'Operation Endgame',
      year: '2024-2026',
      type: 'Sustained Enabler-Layer Campaign',
      summary: 'Europol- and Eurojust-coordinated campaign in four named phases plus sub-actions since May 2024, aimed at the loader, stealer, and dropper layer beneath ransomware rather than at brands. Phase 1 (May 2024) dismantled IcedID, SystemBC, Pikabot, Smokeloader, and Bumblebee: 100+ servers, 2,000+ domains, 4 arrests. Phase 2 (May 2025) neutralized roughly 300 servers and 650 domains and charged 16 DanaBot defendants. Phase 3 (Nov 2025) took 1,025 servers down (Rhadamanthys, VenomRAT, Elysium). The June 2026 phase hit SocGholish, Amadey, and StealC: 326 servers and 142 domains actioned, roughly EUR 41M in crypto frozen, 27M stolen credentials recovered (Confirmed).',
      lesson: 'Attrition, not collapse. Each phase removes shared tooling that many crews depend on, the correct target logic, and the campaign has widened into the money (Cryptex and PM2BTC, Sep 2024) and the demand side (Smokeloader customer detentions from a seized client database). The dependency it cannot reach is the BPH/state pairing: Russian-hosted infrastructure under formalized FSB visibility and deliberate non-enforcement, sheltering operators who stay beyond arrest. Supply rebuilds wherever the operators remain out of reach (Analyst inference).',
      effects: {
        loaders: {
          level: 'SIGNIFICANT',
          note: 'IcedID and Pikabot never rebuilt. DanaBot inert for 13 months after full attribution of 16 defendants, the best malware outcome achieved without arrests. Bumblebee, SystemBC, and Smokeloader returned and were re-hit in 2025. The June 2026 phase dismantled Amadey (delivering eight malware families across 53 clusters) and SocGholish (14,971 compromised sites remediated). The loader market as a category persisted through every phase (Confirmed).'
        },
        stealers: {
          level: 'PARTIAL',
          note: 'Rhadamanthys reduced to a residual trickle after Nov 2025 (525,303 infections Mar-Nov 2025, displaced customers migrating to Vidar). StealC, the main beneficiary of the 2025 LummaC2 takedown, was hit in turn in June 2026. The Lumma precedent grades the category: near-full reconstitution within weeks when developers remain at large; three Lumma operators were personally designated by the EU and UK in July 2026 (Confirmed).'
        },
        crypters: {
          level: 'LIMITED',
          note: 'No phase has targeted crypter or CaaS infrastructure at scale despite the campaign establishing the template. The first enforcement action of any kind against a crypter vendor came in July 2026 (OFAC designation of Silayev), a designation with no custody or infrastructure component (Confirmed).'
        },
        bph: {
          level: 'LIMITED',
          note: 'Hosting was not a co-equal target alongside C2 seizure in any phase, the gap that priced fast loader reconstitution. Russian-hosted successor C2 (Lumma on Selectel) sits in a jurisdiction with documented lower Western LE responsiveness and, under Order No. 1174 (May 2026), formalized FSB intercept access: comprehensive state visibility paired with deliberate non-enforcement (Confirmed).'
        },
        fsb: {
          level: 'LIMITED',
          note: 'The campaign is structurally out of range of the protection layer. Charged operators are overwhelmingly Russian nationals who stay where they are; a $10M reward for information on Ivanov substitutes for an arrest that cannot happen. Servers seized is an activity metric; an operator in a courtroom is an outcome metric, and the gap between them is the krysha (Analyst inference).'
        }
      }
    },
    {
      id: 'blackbasta',
      label: 'Black Basta Leaks',
      year: '2025',
      type: 'Internal Leak (Ongoing)',
      summary: 'Large volume of internal Black Basta chat logs leaked publicly in February 2025, attributed to an internal financial dispute. Exposed internal communications, operational processes, victim negotiation transcripts, and personnel information. Effects still developing at document preparation.',
      lesson: 'Pre-existing financial disputes visible in leaked content confirm the recruitment term shifts proxy metric: when internal disputes are about financial splits, the group is under pressure. Monitor affiliate compensation complaints on underground forums as early warning before a leak event occurs.',
      effects: {
        raas: {
          level: 'SIGNIFICANT',
          note: 'Internal financial disputes visible in leaked content. Pre-existing strife accelerated by leak. 90-day dissolution status PENDING. Comparison to Conti suggests potential dissolution pattern if protection layer is not intact.'
        },
        forums: {
          level: 'SIGNIFICANT',
          note: 'Trust disruption within affiliate and partner network. Victim negotiation transcripts exposed, undermining future negotiation credibility.'
        },
        affiliate: {
          level: 'MODERATE',
          note: 'Affiliate effects still developing. Conti comparison suggests potential for 90-day dissolution pattern. Recruiting term shifts and forum complaint patterns being monitored.'
        }
      }
    },
    {
      id: 'garantex',
      label: 'Garantex Lineage',
      year: '2025-2026',
      type: 'Financial-Layer Seizure + Sanctions Sequence',
      summary: 'March 2025 coalition takedown seized Garantex domains and servers, froze roughly $26M plus $28M in Tether-frozen USDT, and unsealed indictments against both co-founders. Successor Grinex, incorporated in Kyrgyzstan roughly three months before the takedown, was live in under 13 days with customer balances migrated via the A7A5 token and shared Telegram channels. Grinex went dark in April 2026 after a roughly $13.7M theft with unresolved attribution (the exit-scam hypothesis is credible); displaced trading concentrated onto Meer (Meer.kg) and a short set of named Russia-based venues. The A7A5 settlement rail underneath cleared through every rebrand (Confirmed).',
      lesson: 'Brands churn, the settlement rail persists. Exchange front-ends rebuilt in days; the rail (banking access, correspondent relationships, state alignment) absorbed designations from three jurisdictions and passed $100B in reported turnover. Pressure aimed at names buys weeks; pressure aimed at the settlement function is what buys structural change (Analyst inference).',
      effects: {
        ruexch: {
          level: 'SIGNIFICANT',
          note: 'The brand layer churned twice. Garantex seized March 2025 (roughly $96-100B lifetime throughput ended under the brand, technical admin Besciokov arrested in India, co-founder Mira Serda at large); successor Grinex processed $16.54B before its April 2026 suspension. Each brand death displaced rather than destroyed the conversion function: volume re-concentrated within days onto Meer and named Russia-based venues (Confirmed).'
        },
        exchl: {
          level: 'PARTIAL',
          note: 'First UK use of Regulation 17A against cryptoasset exchanges (May 26, 2026): 18 targets in the A7 network package including HTX, Exmo, Rapira, and Bitpapa, the named absorbers of displaced Garantex/Grinex flow. The EU 20th package banned transactions with all Russia- and Belarus-based crypto providers from May 24, 2026. Bitpapa (triple-designated) and Rapira were still operating at document preparation (Confirmed).'
        },
        a7a5: {
          level: 'LIMITED',
          note: 'The chokepoint that did not move. The ruble settlement rail carried Garantex customer balances into Grinex, cleared roughly $93B in its first year, and passed $100B in reported turnover while absorbing designations from OFAC (Aug 2025), the EU (Oct 2025 token ban), and the UK (May 2026). Daily volume fell from a roughly $1.5B peak to roughly $500M, but the settlement function kept clearing (Confirmed).'
        },
        otc: {
          level: 'LIMITED',
          note: 'Displaced ruble conversion routed toward OTC brokers and non-designated Central Asian venues within days of each brand death: the documented displacement pattern, not disruption. Venue compression over roughly 9 months narrowed the absorber set, which shrinks the target set for the next round of pressure (Credible).'
        }
      }
    }
  ]
};
