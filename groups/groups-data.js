/* groups-data.js — SINGLE SOURCE OF TRUTH for the group library.
   Both the directory grid (index.html) and the per-page sidebar/lineage
   crosswalk (nav.js) read window.GROUPS from here.

   To add a group: append one object below. Fields:
     slug     file name without .html (also the card/link target)
     name     display name
     id       two-digit catalogue id (string)
     status   Active | Disrupted | Inactive | Defunct   (drives grid + sidebar bucket)
     era      optional: 'origins' pins the group into the Origins sidebar section
     model    RaaS | Data Extortion | Botnet            (grid filter)
     active   e.g. '2020 to 2022'                       (sidebar sorts by start year)
     color    accent hex (card border + sidebar dot)
     img      banner image path (falls back to monogram if missing)
     note     one-line summary for the directory card
     related  array of slugs for the in-page 'Lineage & related' chip row
*/
window.GROUPS = [
  {slug:'akira',name:'Akira',id:'01',status:'Active',model:'RaaS',active:'2023 to present',color:'#e63946',img:'photos/akira.svg',note:'Double-extortion RaaS targeting SMBs and enterprise; linked to former Conti affiliates.',related:['conti']},
  {slug:'clop',name:'Cl0p',id:'09',status:'Active',model:'Data Extortion',active:'2019 to present',color:'#00897b',img:'photos/clop.svg',note:'FIN11/TA505 core. Mass MFT exploitation: GoAnywhere, MOVEit, Cleo. 1,000+ victims.',related:[]},
  {slug:'dragonforce',name:'DragonForce',id:'03',status:'Active',model:'RaaS',active:'2023 to present',color:'#e67e22',img:'photos/dragonforce.svg',note:'Ransomware cartel model with white-label affiliate infrastructure; deployed by Scattered Spider.',related:['scatteredspider']},
  {slug:'lynx',name:'Lynx / INC',id:'05',status:'Active',model:'RaaS',active:'2024 to present',color:'#3498db',img:'photos/lynx.svg',note:'Absorbed INC Ransom operations; shared code base. Double extortion; critical-infrastructure targeting.',related:[]},
  {slug:'silentransom',name:'Luna Moth / SRG',id:'10',status:'Active',model:'Data Extortion',active:'2021 to present',color:'#8b5cf6',img:'photos/silentransom.svg',note:'No encryption; pure data extortion via callback phishing. Targets legal and financial sectors.',related:[]},
  {slug:'nightspire',name:'NightSpire',id:'12',status:'Active',model:'RaaS',active:'2025 to present',color:'#0ea5e9',img:'photos/nightspire.svg',note:'Go-based double extortion transitioning to full RaaS; 259+ victims across 30+ countries.',related:[]},
  {slug:'payload',name:'Payload',id:'13',status:'Active',model:'RaaS',active:'2026 to present',color:'#e056fd',img:'photos/payload.svg',note:'Babuk-derived; emerged Feb 2026. Double extortion against Windows and VMware ESXi. Emerging.',related:[]},
  {slug:'qilin',name:'Qilin',id:'06',status:'Active',model:'RaaS',active:'2022 to present',color:'#f1c40f',img:'photos/qilin.svg',note:'Go/Rust encryptor; aggressive healthcare targeting. Absorbed former RansomHub affiliates in 2025.',related:['scatteredspider','thegentlemen']},
  {slug:'scatteredspider',name:'Scattered Spider',id:'16',status:'Active',model:'Data Extortion',active:'2022 to present',color:'#e67e22',img:'photos/scatteredspider.svg',note:'English-speaking social-engineering collective (The Com). Deploys ALPHV, RansomHub, Qilin, DragonForce.',related:['dragonforce','qilin','alphv']},
  {slug:'thegentlemen',name:'The Gentlemen',id:'11',status:'Active',model:'RaaS',active:'2025 to present',color:'#c9a84c',img:'photos/thegentlemen.svg',note:'Qilin splinter; 420+ victims across 50+ countries. Self-propagating Go encryptor; GPO propagation.',related:['qilin']},
  {slug:'worldleaks',name:'World Leaks / Hunters Intl',id:'14',status:'Active',model:'Data Extortion',active:'2025 to present',color:'#16a085',img:'photos/worldleaks.svg',note:'Jan 2025 rebrand of Hunters International (Hive lineage). Extortion-as-a-service; no encryption.',related:[]},
  {slug:'lockbit',name:'LockBit',id:'04',status:'Disrupted',model:'RaaS',active:'2019 to present',color:'#2ecc71',img:'photos/lockbit.svg',note:'Largest RaaS globally. Infrastructure seized Feb 2024 (Operation Cronos); admin indicted; attempted reconstitution.',related:[]},
  {slug:'8base',name:'8Base / Phobos',id:'21',status:'Disrupted',model:'RaaS',active:'2022 to 2025',color:'#9acd32',img:'photos/8base.svg',note:'Phobos RaaS affiliate running mass double extortion against SMBs; ~$16M traced. Seized in Operation Phobos Aetor (Feb 2025).',related:[]},
  {slug:'royal',name:'Royal / BlackSuit / Chaos',id:'07',status:'Disrupted',model:'RaaS',active:'2022 to 2025',color:'#8e44ad',img:'photos/royal.svg',note:'Conti Team One lineage; $500M+ demands. Disrupted by Operation Checkmate (Jul 2025); assessed rebrand to Chaos.',related:['conti']},
  {slug:'blackbasta',name:'Black Basta',id:'08',status:'Inactive',model:'RaaS',active:'2022 to 2025',color:'#7d1e1e',img:'photos/blackbasta.svg',note:'Conti Team 3 successor; $107M+ revenue, 500+ victims. Collapsed Jan 2025 after internal chat leaks.',related:['conti']},
  {slug:'alphv',name:'ALPHV / BlackCat',id:'15',status:'Defunct',model:'RaaS',active:'2021 to 2024',color:'#c0392b',img:'photos/alphv.svg',note:'DarkSide/BlackMatter lineage; first major Rust-based RaaS. Ended in the Change Healthcare exit scam.',related:['darkside','scatteredspider']},
  {slug:'conti',name:'Conti',id:'02',status:'Defunct',model:'RaaS',active:'2020 to 2022',color:'#9b59b6',img:'photos/conti.svg',note:'Russia-linked, FSB-connected. Dissolved 2022 after leaks; parent to Black Basta, Royal, Akira affiliates.',related:['ryuk','trickbot','blackbasta','royal','akira']},
  {slug:'darkside',name:'DarkSide / BlackMatter',id:'19',status:'Defunct',model:'RaaS',active:'2020 to 2021',color:'#5b6b86',img:'photos/darkside.svg',note:'Closed-operator RaaS behind Colonial Pipeline; $90M+ from 47 victims. Anchor of the DarkSide to ALPHV lineage.',related:['alphv']},
  {slug:'revil',name:'REvil / Sodinokibi',id:'20',status:'Defunct',model:'RaaS',active:'2019 to 2021',color:'#b03a2e',img:'photos/revil.svg',note:'GandCrab successor behind Kaseya and JBS; first $70M ransom demand. FSB arrests Jan 2022, most later released.',related:[]},
  {slug:'ryuk',name:'Ryuk',id:'17',status:'Defunct',model:'RaaS',active:'2018 to 2021',color:'#94a3b8',img:'photos/ryuk.svg',note:'TrickBot-delivered big-game hunting pioneer; $150M+ traced. Wizard Spider; retooled into Conti.',related:['trickbot','conti']},
  {slug:'trickbot',name:'TrickBot',id:'18',status:'Defunct',era:'origins',model:'Botnet',active:'2016 to 2022',color:'#d35400',img:'photos/trickbot.svg',note:'Banking trojan turned access broker for Ryuk and Conti; 1M+ infections. Named in Operation Endgame.',related:['dyre','ryuk','conti']},
  {slug:'zeus',name:'Zeus / GameOver Zeus',id:'22',status:'Defunct',era:'origins',model:'Botnet',active:'2006 to 2014',color:'#a9865f',img:'photos/zeus.svg',note:'Origin node of the Russia/CIS ecosystem: Zeus kit, GameOver Zeus botnet, and CryptoLocker. Bogachev "Slavik"; disrupted by Operation Tovar. Root of the Evil Corp line.',related:['dyre']},
  {slug:'dyre',name:'Dyre / Dyreza',id:'23',status:'Defunct',era:'origins',model:'Botnet',active:'2014 to 2015',color:'#5f8aa9',img:'photos/dyre.svg',note:'Closed-gang banking trojan that filled the GameOver Zeus vacuum; disrupted by a 2015 Moscow raid. Bridge node that regrouped as TrickBot.',related:['zeus','trickbot']}
];
