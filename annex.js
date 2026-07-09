window.APT_ANNEX = {
  "taxonomy": {
    "whyNoNumber": "「番号のないAPT」が存在する最大の理由は、脅威インテリジェンス業界に単一の命名主体が存在せず、各ベンダーが自社の収集経路・確度評価・命名思想に基づき独自にグループを追跡しているためとされる。Mandiant(旧FireEye)は「UNC(Uncategorized、未分類)」という受け皿カテゴリを持ち、単一インシデント等で観測された侵入クラスタ(インフラ・ツール・戦術)を、国家関与の確証がまだない段階でひとまず番号だけ振って追跡する。証拠が積み上がり複数のUNCクラスタが統合されると「TEMP」という暫定名(例: TEMP.Warlock)を経ることもあり、最終的に国家関与の確度が十分高まった場合にのみ「APT[数字]」への\"昇格\"が行われる。金銭目的の犯罪グループは「FIN[数字]」に分類される。つまりAPT番号は業界横断の唯一の識別子ではなく、Mandiantという一社の分析パイプラインにおける「最終確定ラベル」に過ぎず、多くの活動はUNCやTEMPの段階に留まったまま公表される、あるいは他ベンダー独自の名称(Cozy Bear、Midnight Blizzard等)で先に知られることがあるとされる。さらにMicrosoftやCrowdStrikeはそもそも「APT」という数字体系自体を採用しておらず、Microsoftは気象ファミリー名+形容詞(例: Midnight Blizzard)、CrowdStrikeは国別動物+固有語の2部構成暗号名(例: Cozy Bear)を使う。これらは名称自体に帰属国や動機の情報を埋め込む設計であり、MITRE ATT&CKのようにあえて没個性的な「G####」を使う思想とも異なる。実例として、SolarWinds事件で使われた侵入クラスタはMandiantでは当初「UNC2452」だったが、2022年4月27日にMandiantが十分な証拠を得たとして「APT29」へ統合したと公表しており、この同一グループはMicrosoftでは当初「NOBELIUM」、現在は「Midnight Blizzard」、CrowdStrikeでは「Cozy Bear」と呼ばれている。",
    "mandiant": "Mandiant(現Google Threat Intelligence傘下)は主に4系列の接頭辞を使うとされる。「APT[XX]」は国家(nation-state)関与が確度高く評価された攻撃グループ、「FIN[XX]」は金銭目的の犯罪グループ、「UNC[XX]」(Uncategorized)は単一インシデント等で観測された未分類の侵入活動クラスタで、インフラ・ツール・戦術といった特徴に基づき作成される受け皿的な分類とされる。「TEMP」は複数のUNCクラスタが関連性を強め、特定グループへ収斂しつつある段階で使われる暫定的な作業名(例: TEMP.Warlock)とされる。典型的な昇格経路は UNC→TEMP→APT/FIN であり、実例としてUNC902がTEMP.Warlockを経てFIN11に「卒業」したとされる。UNC2452→APT29の統合は2022年4月27日にGoogle Cloud Blog(Mandiant)で公表され、SolarWinds侵害の追跡名だったUNC2452が、Mandiant自身の一次収集データと米国政府の公式帰属声明(2021年4月)との整合、TTP・インフラの一致等を根拠にAPT29(ロシア対外情報庁SVR配下と評価される)へ統合されたとされる。UNCからAPT/FINへの昇格には通常数年規模の時間がかかるとされる。",
    "crowdstrike": {
      "desc": "CrowdStrikeは2011年の創業時から2部構成の「暗号名(cryptonym)」体系を採用しているとされる。1語目はコミュニティ識別子やTTP・標的情報に基づく固有の語、2語目は出身国または動機を示す語とされる。国家系は出身国の象徴的動物、犯罪(eCrime)系は「Spider」、ハクティビストは「Jackal」で統一される(CrowdStrike公式ブログ「Naming Adversaries and Why It Matters to Your Security Team」参照)。なお BEAR=ロシア・PANDA=中国・CHOLLIMA=北朝鮮・KITTEN=イラン等の主要な対応は広く確認できるが、Crane=韓国・Wolf=トルコ・Hawk=シリア・Bison=ベラルーシといった一部の国別対応は公式一次情報での網羅的な確認が難しく、二次的なベンダー資料に基づくものを含む。2025年6月2日、CrowdStrikeとMicrosoftは異なるベンダー間の命名を相互マッピングする共同イニシアチブを発表し、当初80以上のアクター名を突合したとされる(例: Volt TyphoonとVANGUARD PANDAが同一の中国国家系アクター、Secret BlizzardとVENOMOUS BEARが同一のロシア関連アクターと確認)。",
      "suffixes": [
        {
          "suffix": "Bear",
          "country": "ロシア"
        },
        {
          "suffix": "Panda",
          "country": "中国"
        },
        {
          "suffix": "Chollima",
          "country": "北朝鮮"
        },
        {
          "suffix": "Kitten",
          "country": "イラン"
        },
        {
          "suffix": "Tiger",
          "country": "インド"
        },
        {
          "suffix": "Leopard",
          "country": "パキスタン"
        },
        {
          "suffix": "Buffalo",
          "country": "ベトナム"
        },
        {
          "suffix": "Crane",
          "country": "韓国"
        },
        {
          "suffix": "Wolf",
          "country": "トルコ"
        },
        {
          "suffix": "Hawk",
          "country": "シリア"
        },
        {
          "suffix": "Bison",
          "country": "ベラルーシ"
        },
        {
          "suffix": "Jackal",
          "country": "パレスチナ/ハクティビスト全般"
        },
        {
          "suffix": "Spider",
          "country": "金銭目的の犯罪グループ(国非依存)"
        }
      ]
    },
    "microsoft": {
      "desc": "Microsoftは2023年4月18日、脅威アクターの命名体系を元素名・DEV-####等から気象現象テーマへ刷新すると発表したとされる(Microsoft Learn公式ページで継続更新)。脅威アクターを「国家系」「金銭動機系」「民間攻撃的アクター(PSOA)」「情報操作」「開発中グループ」の5カテゴリに整理し、それぞれに「ファミリー名」を割り当てる。国家系は帰属国・地域ごとに個別のファミリー名を持ち(中国=Typhoon、ロシア=Blizzard、北朝鮮=Sleet、イラン=Sandstorm、韓国=Hail、トルコ=Dust、ベトナム=Cyclone、レバノン=Rain等、Microsoft Learn記載時点で20か国以上に個別ファミリー名が割当済み)、金銭動機はTempest、PSOAはTsunami、情報操作はFloodで統一される。同一ファミリー内の個別グループは形容詞で区別され(例: Midnight Blizzard、Forest Blizzard、Secret Blizzardは全てロシア関連だが別グループ)、素性が固まっていない新規クラスタには暫定的に「Storm-####」という4桁番号が付与され、十分な分析が進むと正式名称へ移行するとされる。",
      "families": [
        {
          "family": "Typhoon",
          "country": "中国"
        },
        {
          "family": "Blizzard",
          "country": "ロシア"
        },
        {
          "family": "Sleet",
          "country": "北朝鮮"
        },
        {
          "family": "Sandstorm",
          "country": "イラン"
        },
        {
          "family": "Hail",
          "country": "韓国"
        },
        {
          "family": "Dust",
          "country": "トルコ"
        },
        {
          "family": "Cyclone",
          "country": "ベトナム"
        },
        {
          "family": "Rain",
          "country": "レバノン"
        },
        {
          "family": "Tempest",
          "country": "金銭動機(国非依存)"
        },
        {
          "family": "Tsunami",
          "country": "民間攻撃的アクター(PSOA)"
        },
        {
          "family": "Flood",
          "country": "情報操作"
        },
        {
          "family": "Storm-####",
          "country": "開発中・未確定グループ(暫定番号)"
        }
      ]
    },
    "others": "MITRE ATT&CKは「G####」という没個性的な番号のみでグループを識別し、他ベンダー名は「Associated Groups」欄に集約表示することで、特定の名称に権威を与えない中立的立場を取るとされる(例: G0016ページにIRON RITUAL、Dark Halo、NOBELIUM、UNC2452、Cozy Bear、Midnight Blizzard等が列記)。Cisco TalosはMandiant同様「UAT-####」のような英数字識別子を用いる一方、KasperskyやESETは神話・固有名詞的な独自コードネーム(例: Turla)を用いるなど、感情的・比喩的な文脈を持つ命名文化とされる。業界全体として統一された標準は存在せず、各社が収集経路や確度評価の違いから独立に命名しているとされる。",
    "crossExamples": [
      {
        "canonical": "APT29(ロシア対外情報庁SVR関連と評価)",
        "names": "APT29(Mandiant)= Cozy Bear(CrowdStrike)= Midnight Blizzard/旧NOBELIUM(Microsoft)= UNC2452(Mandiant初期名/FireEye)= The Dukes(F-Secure/ESET)= Dark Halo(Volexity)"
      },
      {
        "canonical": "APT28(ロシア軍参謀本部情報総局GRU関連と評価)",
        "names": "APT28(Mandiant)= Fancy Bear(CrowdStrike)= Forest Blizzard/旧STRONTIUM(Microsoft)= Sofacy/Sednit(Kaspersky/ESET系)"
      },
      {
        "canonical": "Volt Typhoon系(中国、通信・重要インフラ標的と評価)",
        "names": "Volt Typhoon(Microsoft)= Vanguard Panda(CrowdStrike)= BRONZE SILHOUETTE(Secureworks)——2025年のMicrosoft-CrowdStrike共同マッピングでVolt Typhoon/Vanguard Pandaが同一アクターと確認されたとされる"
      },
      {
        "canonical": "Turla(ロシア、老舗のサイバースパイグループと評価)",
        "names": "Secret Blizzard/旧KRYPTON(Microsoft)= VENOMOUS BEAR(CrowdStrike)= Turla/Uroburos/Snake(Kaspersky/ESET)"
      }
    ]
  },
  "groups": [
    {
      "id": "volt-typhoon",
      "name": "Volt Typhoon",
      "nameJa": "ヴォルト・タイフーン",
      "country": "中国",
      "countryCode": "CN",
      "attribution": "中華人民共和国国家支援型サイバーアクターとされる(米CISA・NSA・FBI等が共同で評価)。特定の軍・情報機関部隊への帰属は公式には未公表。",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Volt Typhoon(旧称 DEV-0391 / Storm-0391)"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "UNC3236"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Vanguard Panda"
        },
        {
          "vendor": "Secureworks",
          "name": "BRONZE SILHOUETTE"
        },
        {
          "vendor": "Dragos",
          "name": "Voltzite"
        },
        {
          "vendor": "Palo Alto Networks (Unit 42)",
          "name": "Insidious Taurus"
        }
      ],
      "mitre": "G1017",
      "firstSeen": "2021年半ば頃(中盤)",
      "hook": "米重要インフラに潜む沈黙の事前配置者",
      "summary": "Volt Typhoonは、2021年半ば頃から活動が確認されている中国政府の国家支援型とされるサイバーアクターであり、米CISA・NSA・FBIおよび五眼諸国のパートナー機関が2024年2月の共同勧告(AA24-038A)で警告した。最大の特徴は、正規の管理ツールやOS標準機能のみを用いる「Living-off-the-Land(LOTL)」技法を徹底し、マルウェアをほぼ使わずに検知を回避する点である。当初はスパイ活動と評価されたが、その後の分析で、通信・エネルギー・上下水道・運輸などの米重要インフラのIT/OT環境に長期潜伏し、将来の軍事的危機や台湾を巡る紛争時に破壊的サイバー攻撃を実行できるよう事前配置(prepositioning)することが主目的と評価されるに至った。2023年にはマサチューセッツ州の電力・水道公益事業に約10か月間潜伏していた事案が確認されており、Dragosは運用技術(OT)データの窃取を狙ったものと分析している。Microsoft、Mandiant、CrowdStrike、Dragos等複数ベンダーがそれぞれ独自の名称で追跡していたが、現在は同一グループとして整理されている。",
      "purposes": [
        "prepositioning",
        "espionage",
        "surveillance",
        "destructive"
      ],
      "sectors": [
        "通信",
        "エネルギー",
        "運輸システム",
        "上下水道",
        "製造",
        "政府",
        "情報技術",
        "教育",
        "海事",
        "建設"
      ],
      "malware": [
        "KV Botnet",
        "VersaMem(ウェブシェル)",
        "Fast Reverse Proxy(FRP)",
        "Impacket",
        "Mimikatz",
        "Earthworm",
        "certutil/netsh/wevtutil等のLOLBins"
      ],
      "notableOps": [
        {
          "year": "2023",
          "title": "グアム・米重要インフラへの侵入をMicrosoftが公表",
          "desc": "2023年5月、Microsoftが通信・製造・公益事業・運輸等のグアムおよび米本土の重要インフラ組織への侵入を公表。生存戦略(LOTL)技法を強調"
        },
        {
          "year": "2023-2024",
          "title": "マサチューセッツ州電力・水道公益事業への約10か月の潜伏",
          "desc": "Littleton Electric Light and Water Departmentsのシステムに2023年2月から約10か月間潜伏。DragosはOT運用データや地理空間データの窃取を狙ったと分析"
        },
        {
          "year": "2024",
          "title": "CISA・NSA・FBIと国際パートナーによる共同勧告(AA24-038A)",
          "desc": "2024年2月、五眼諸国を含む共同勧告で、危機・紛争時の破壊的攻撃に備えた重要インフラへの事前配置(prepositioning)であると警告"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "CISA - PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure (AA24-038A)",
          "url": "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a"
        },
        {
          "title": "Microsoft Security Blog - Volt Typhoon targets US critical infrastructure with living-off-the-land techniques",
          "url": "https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/"
        },
        {
          "title": "MITRE ATT&CK - Volt Typhoon, G1017",
          "url": "https://attack.mitre.org/groups/G1017/"
        },
        {
          "title": "CrowdStrike Adversary Universe - Vanguard Panda",
          "url": "https://www.crowdstrike.com/en-us/adversaries/vanguard-panda/"
        },
        {
          "title": "The Record from Recorded Future News - Volt Typhoon hackers were in Massachusetts utility's systems for 10 months",
          "url": "https://therecord.media/volt-typhoon-hackers-utility-months"
        }
      ]
    },
    {
      "id": "salt-typhoon",
      "name": "Salt Typhoon",
      "nameJa": "ソルト・タイフーン",
      "country": "中国",
      "countryCode": "CN",
      "attribution": "中国国家安全部(MSS)関連とされる。2025年8月のCISA等共同勧告(AA25-239A)では、関連する中国拠点企業(Sichuan Juxinhe Network Technology等)が人民解放軍(PLA)複数部隊および国家安全部(MSS)の双方に技術・攻撃能力を提供していると指摘されている",
      "vendorNames": [
        {
          "vendor": "Trend Micro",
          "name": "Earth Estries"
        },
        {
          "vendor": "Kaspersky",
          "name": "GhostEmperor"
        },
        {
          "vendor": "ESET",
          "name": "FamousSparrow"
        },
        {
          "vendor": "Mandiant/Google",
          "name": "UNC2286"
        },
        {
          "vendor": "CrowdStrike",
          "name": "OPERATOR PANDA"
        },
        {
          "vendor": "Recorded Future",
          "name": "RedMike"
        }
      ],
      "mitre": "G1045",
      "firstSeen": "2019年頃(遅くとも)",
      "hook": "米通信網の合法傍受システムに侵入",
      "summary": "Salt Typhoonは、中国国家安全部(MSS)との関連が指摘される国家支援型サイバースパイ集団で、遅くとも2019年から活動しているとされる。2024年に発覚した事案では、Verizon、AT&T、T-Mobileなど米大手通信キャリア9社以上に侵入し、法執行機関向けの合法的傍受(CALEA)システムへアクセス、通話・SMSのメタデータや盗聴対象者リストを窃取したと報じられた。2025年8月にはCISA・FBI・NSA等が主導し13カ国が参加する共同勧告(AA25-239A)が公表され、Cisco・Ivanti・Palo Alto Networks製のエッジルーター等ネットワーク機器の脆弱性(CVE-2018-0171含む)を悪用し、80カ国以上・200を超える通信、政府、運輸、宿泊、軍事インフラ組織に持続的アクセスを確立していたことが明らかにされた。カスタムツール「JumbledPath」によるログ消去やデータ窃取のほか、認証情報操作やACL改変によるファイアウォール無効化などの手口が確認されている。GhostEmperor、FamousSparrow、Earth Estries、UNC2286、Operator Pandaなど複数ベンダーの追跡クラスターと活動が重なるとされ、単一グループか複数関連クラスターの集合かについては業界内で議論が続いている。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "通信",
        "政府",
        "運輸",
        "宿泊",
        "軍事インフラ",
        "ISP"
      ],
      "malware": [
        "JumbledPath",
        "Demodex rootkit",
        "SnappyBee (Deed RAT)",
        "GhostSpider",
        "Masol RAT"
      ],
      "notableOps": [
        {
          "year": "2024",
          "title": "米通信キャリア大規模侵害・CALEA合法傍受システム侵入",
          "desc": "Verizon、AT&T、T-Mobile等9社以上に侵入し、法執行機関の傍受対象リストや通話メタデータを窃取したとされる"
        },
        {
          "year": "2025年8月",
          "title": "CISA等13カ国共同勧告(AA25-239A)",
          "desc": "80カ国200以上の組織のエッジルーター等ネットワーク機器を侵害し、世界規模の諜報網を構築していたと公表"
        },
        {
          "year": "2025",
          "title": "Cisco/Ivanti/Palo Alto製エッジ機器の脆弱性悪用",
          "desc": "通信・政府・運輸・宿泊・軍事インフラのプロバイダエッジ/カスタマーエッジルーターを標的に持続的侵入を継続"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "CISA AA25-239A: Countering Chinese State-Sponsored Actors Compromise of Networks Worldwide to Feed Global Espionage System",
          "url": "https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-239a"
        },
        {
          "title": "MITRE ATT&CK - Salt Typhoon (G1045)",
          "url": "https://attack.mitre.org/groups/G1045/"
        },
        {
          "title": "The Hacker News - Salt Typhoon Exploits Flaws in Edge Network Devices to Breach 600 Organizations Worldwide",
          "url": "https://thehackernews.com/2025/08/salt-typhoon-exploits-cisco-ivanti-palo.html"
        }
      ]
    },
    {
      "id": "mustang-panda",
      "name": "Mustang Panda",
      "nameJa": "マスタング・パンダ",
      "country": "中国",
      "countryCode": "CN",
      "attribution": "中華人民共和国(PRC)の国家支援を受けるハッカー集団とされる(米司法省は「PRC政府から資金提供を受けてPlugXの当該亜種を開発した」と説明)",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Twill Typhoon"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Mustang Panda(CrowdStrikeによる命名)"
        },
        {
          "vendor": "Mandiant/Google",
          "name": "TEMP.Hex / UNC6384"
        },
        {
          "vendor": "Proofpoint",
          "name": "TA416"
        },
        {
          "vendor": "Secureworks",
          "name": "BRONZE PRESIDENT"
        },
        {
          "vendor": "Check Point",
          "name": "Camaro Dragon"
        },
        {
          "vendor": "Trend Micro",
          "name": "Earth Preta"
        },
        {
          "vendor": "IBM X-Force",
          "name": "HIVE0154"
        },
        {
          "vendor": "Palo Alto Networks (Unit 42)",
          "name": "Stately Taurus (旧Red Delta)"
        },
        {
          "vendor": "その他",
          "name": "FIREANT / TANTALUM / LUMINOUS MOTH / Red Lich / ClumsyToad"
        }
      ],
      "mitre": "G0129",
      "firstSeen": "2012年頃(活動確認は2014年以降が明確)",
      "hook": "アジア・欧州を狙う中国系スパイの雄",
      "summary": "Mustang Pandaは、中華人民共和国(PRC)の国家的利益に沿ったサイバースパイ活動を行うとされる中国系脅威アクターで、MITRE ATT&CKではG0129として分類される。2012年頃から活動し、少なくとも2014年以降は東南アジア・欧州・米国の政府機関、外交団、NGO(シンクタンク、宗教団体、研究機関)、中国の反体制派組織などを標的にしてきた。標的国にはミャンマー、モンゴル、パキスタン、ベトナム、ロシア、フィリピン、スロバキア、バチカンなどが含まれるとされる。代表的なマルウェアはモジュール型リモートアクセス型トロイの木馬PlugX(SOGU)で、他にTONESHELL、PUBLOAD、ShadowPad、Cobalt Strikeなども使用する。精巧なスピアフィッシングとおとり文書、正規署名バイナリを悪用したDLLサイドローディング、USBワーム型拡散、キャプティブポータル乗っ取りによる中間者攻撃など多様な手法を用いる。2025年1月には米司法省・FBIがフランス当局・Sekoia.ioと協力し、感染した米国内約4,258台のコンピュータからPlugXを削除する法執行作戦を実施したが、その後もLOTUSLITEやSnakeDiskなど新ツールへの切り替えで活動を継続しているとされる。呼称は非常に多く、Microsoftは「Twill Typhoon」、CrowdStrikeは「Stately Taurus」、Mandiant/Googleは「TEMP.Hex」または「UNC6384」と呼ぶなど、ベンダーごとに異なる。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "政府機関",
        "外交団",
        "NGO(シンクタンク・宗教団体)",
        "研究機関",
        "中国反体制派組織",
        "通信事業者"
      ],
      "malware": [
        "PlugX (SOGU)",
        "TONESHELL",
        "PUBLOAD",
        "ShadowPad",
        "Cobalt Strike",
        "BOOKWORM",
        "SnakeDisk",
        "LOTUSLITE"
      ],
      "notableOps": [
        {
          "year": "2025年1月",
          "title": "米司法省・FBIによるPlugX削除作戦",
          "desc": "仏当局・Sekoia.ioと連携し、裁判所authorization下で米国内約4,258台のPCからPlugXマルウェアを遠隔削除した法執行作戦。"
        },
        {
          "year": "2025年3月",
          "title": "UNC6384による東南アジア外交団への攻撃(Deception in Depth)",
          "desc": "キャプティブポータル乗っ取りと偽Adobeプラグイン更新でCANONSTAGER経由のSOGU.SECバックドアを展開、東南アジアの外交官らを標的とした。"
        },
        {
          "year": "2026年",
          "title": "米政策団体への再展開",
          "desc": "PlugX基盤の無力化後もLOTUSLITEバックドアとSnakeDisk USBワームで米国の政策シンクタンク等を標的に活動を継続しているとされる。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Mustang Panda, TA416, RedDelta, ... Group G0129 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0129/"
        },
        {
          "title": "Mustang Panda Adversary Profile | CrowdStrike",
          "url": "https://www.crowdstrike.com/en-us/adversaries/mustang-panda/"
        },
        {
          "title": "PRC-Nexus Espionage Campaign Hijacks Web Traffic to Target Diplomats | Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/prc-nexus-espionage-targets-diplomats"
        },
        {
          "title": "FBI Deletes PlugX Malware from 4,250 Hacked Computers in Multi-Month Operation | The Hacker News",
          "url": "https://thehackernews.com/2025/01/fbi-deletes-plugx-malware-from-4250.html"
        }
      ]
    },
    {
      "id": "winnti-group",
      "name": "Winnti Group",
      "nameJa": "ウィンティ・グループ",
      "country": "中国",
      "countryCode": "CN",
      "attribution": "中華人民共和国。国営セキュリティ・情報機関との関連が指摘されるが、Winnti Groupという呼称自体は複数の中国系ハッカーグループ(サブグループ)を包含する「傘(umbrella)」的な概念であり、単一の指揮系統に一元化されているとは断定できない",
      "vendorNames": [
        {
          "vendor": "CrowdStrike",
          "name": "Wicked Panda(諜報活動側)/Wicked Spider(金銭目的活動側)"
        },
        {
          "vendor": "Microsoft",
          "name": "Brass Typhoon(旧BARIUM)"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "APT41"
        },
        {
          "vendor": "Kaspersky/ESET/ClearSky",
          "name": "Winnti / Winnti Group"
        },
        {
          "vendor": "Symantec/Broadcom",
          "name": "Blackfly"
        }
      ],
      "mitre": "G0044",
      "firstSeen": "2010年頃(MITRE ATT&CK記載)、一部報告では2009年〜2012年頃から活動しているとされる",
      "hook": "ゲーム業界を狙う証明書窃取の傘組織",
      "summary": "Winnti Groupは中国を起源とするとされる脅威アクターで、MITRE ATT&CKでは2010年以降活動する単一グループ(G0044、別名Blackfly)として登録される一方、実態としては複数の中国系サブグループを束ねる「Winnti umbrella」という概念で語られることが多い。最大の特徴はゲーム業界(オンライン・MMOタイトルの開発会社)を標的とし、ビルドシステムやコード署名証明書を窃取して正規のソフトウェアやマルウェアに不正署名する手口で、CCleanerやASUS LiveUpdateを悪用したサプライチェーン攻撃、2020年のPipeMonバックドアによる韓国・台湾ゲーム企業侵害などが代表例。米司法省は2019〜2020年、Winnti/Barium/Wicked Panda/APT41と呼ばれる活動を行った中国籍者らを100社超への侵入で起訴しており、これらの呼称は同一または重複する活動を指すとされる。MITRE上ではWinnti Group(G0044)とAPT41(G0096)は別エントリとして管理され「部分的に重複する」との記載にとどまる一方、CrowdStrikeはWicked Panda(Winnti)にBARIUM・LEAD・APT41・Brass Typhoon等を包含させて同一アクターとして扱うなど、ベンダー間で分類粒度が異なる点に注意が必要。近年は日本を含む製造・エネルギー分野への侵入(2024年RevivalStoneキャンペーン)も確認されており、ゲーム業界に限らず標的を拡大しているとされる。",
      "purposes": [
        "espionage",
        "ip-theft",
        "financial",
        "prepositioning"
      ],
      "sectors": [
        "ゲーム・ソフトウェア開発",
        "テクノロジー",
        "製造業",
        "素材・エネルギー",
        "通信",
        "ヘルスケア",
        "教育"
      ],
      "malware": [
        "Winnti (Winnti for Windows)",
        "PlugX",
        "ShadowPad",
        "PipeMon",
        "HTran",
        "AceHash",
        "Mimikatz(悪用)"
      ],
      "notableOps": [
        {
          "year": "2018-2020",
          "title": "PipeMonバックドアによる韓国・台湾MMOゲーム企業攻撃",
          "desc": "ESETが発見。ビルドシステム侵害によるゲーム実行ファイル改ざんや、2018年の別サプライチェーン攻撃で窃取した証明書によるマルウェア署名が確認された"
        },
        {
          "year": "2019-2020",
          "title": "米司法省による起訴(APT41関係者)",
          "desc": "Winnti/APT41/Barium/Wicked Pandaと呼ばれる活動を行った中国籍5名が、100社以上からのソースコード・コード署名証明書・顧客データ窃取容疑で起訴された"
        },
        {
          "year": "2024",
          "title": "RevivalStoneキャンペーンで日本の製造・素材・エネルギー業界を攻撃",
          "desc": "ERPシステムのSQLインジェクションからWebシェル設置、Winnti RATとルートキットによるTCP/IP通信傍受を伴う侵入が確認された"
        }
      ],
      "relatedApt": [
        "APT41"
      ],
      "sources": [
        {
          "title": "Winnti Group, Blackfly, Group G0044 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0044/"
        },
        {
          "title": "APT41, Wicked Panda, Brass Typhoon, BARIUM, Group G0096 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0096/"
        },
        {
          "title": "Wicked Panda Adversary Profile | CrowdStrike",
          "url": "https://www.crowdstrike.com/en-us/adversaries/wicked-panda/"
        },
        {
          "title": "APT41: A Dual Espionage and Cyber Crime Operation | Google Cloud (Mandiant)",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/apt41-dual-espionage-and-cyber-crime-operation"
        },
        {
          "title": "No 'Game over' for the Winnti Group | ESET WeLiveSecurity",
          "url": "https://www.welivesecurity.com/2020/05/21/no-game-over-winnti-group/"
        },
        {
          "title": "US charges Chinese Winnti hackers for attacking 100+ companies | BleepingComputer",
          "url": "https://www.bleepingcomputer.com/news/security/us-charges-chinese-winnti-hackers-for-attacking-100-plus-companies/"
        },
        {
          "title": "China-linked APT group Winnti targets Japanese organizations | Security Affairs",
          "url": "https://securityaffairs.com/174353/apt/china-linked-apt-group-winnti-targets-japanese-orgs.html"
        }
      ]
    },
    {
      "id": "unc2452",
      "name": "UNC2452",
      "nameJa": "UNC2452(APT29に統合)",
      "country": "ロシア",
      "countryCode": "RU",
      "attribution": "ロシア対外情報庁(SVR)とされる(米・英・カナダ政府およびMandiantの評価)",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "NOBELIUM(旧称)/ Midnight Blizzard(現称)"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Cozy Bear"
        },
        {
          "vendor": "Mandiant/旧FireEye",
          "name": "UNC2452 → APT29(2022年統合)"
        },
        {
          "vendor": "MITRE ATT&CK",
          "name": "The Dukes"
        },
        {
          "vendor": "Secureworks",
          "name": "IRON RITUAL / IRON HEMLOCK"
        },
        {
          "vendor": "Symantec",
          "name": "SolarStorm"
        },
        {
          "vendor": "PwC",
          "name": "Blue Kitsune"
        }
      ],
      "mitre": "G0016",
      "firstSeen": "2008年頃(SVR系クラスタとしての初期活動)/ UNC2452としては2020年12月のSolarWinds事件で命名",
      "hook": "未分類クラスタが国家帰属へ至った代表例",
      "summary": "UNC2452は、2020年12月に発覚したSolarWindsのOrion製品を悪用したサプライチェーン攻撃(SUNBURSTバックドア)の実行主体として、当時FireEye(現Mandiant)が追跡した未分類(Uncategorized)クラスタである。米・英・カナダ政府は2021年4月、この攻撃をロシア対外情報庁(SVR)による活動と公式に評価した。Mandiantは自社の一次情報や活動比較、SVR系クラスタ「APT29」の長年の追跡知見との突合を経て、2022年4月27日にUNC2452をAPT29へ正式統合したと発表した。これは「UNC」という未分類の識別子が、十分な証拠の蓄積により確定帰属クラスタへ格上げされる典型例として、脅威インテリジェンス業界でしばしば引用される。APT29はMicrosoft社ではNOBELIUM(現Midnight Blizzard)、CrowdStrike社ではCozy Bearとも呼ばれ、2015年の民主党全国委員会(DNC)侵入や2024年のMicrosoft社内システム侵害など、長期にわたり欧米の政府・外交機関を標的にしたスパイ活動を継続しているとされる。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "政府機関",
        "外交機関",
        "IT/クラウドサービスプロバイダ",
        "通信",
        "医療研究",
        "シンクタンク/政策研究機関",
        "重要インフラ"
      ],
      "malware": [
        "SUNBURST",
        "TEARDROP",
        "RAINDROP",
        "SUNSPOT",
        "GoldMax",
        "GoldFinder",
        "FoggyWeb",
        "EnvyScout",
        "HAMMERTOSS",
        "MiniDuke",
        "CozyCar",
        "Cobalt Strike(BEACON)"
      ],
      "notableOps": [
        {
          "year": "2020",
          "title": "SolarWinds Orionサプライチェーン攻撃",
          "desc": "SolarWinds社のOrion製品ビルドプロセスを侵害しSUNBURSTバックドアを仕込み、米政府機関含む数千組織へ配布。UNC2452として追跡開始"
        },
        {
          "year": "2015-2016",
          "title": "民主党全国委員会(DNC)侵入",
          "desc": "APT29として2015年夏からDNCネットワークに侵入し情報収集を実施したとされる、後にAPT28とともに公表された事案"
        },
        {
          "year": "2024",
          "title": "Microsoft社内システム侵害(Midnight Blizzard)",
          "desc": "Microsoft社の企業メール環境に侵入し経営幹部や セキュリティ部門のメールを窃取したと同社が公表"
        }
      ],
      "relatedApt": [
        "APT29"
      ],
      "sources": [
        {
          "title": "UNC2452 Merged into APT29 | Google Cloud Blog (Mandiant)",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/unc2452-merged-into-apt29"
        },
        {
          "title": "APT29, Group G0016 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0016/"
        },
        {
          "title": "Midnight Blizzard (NOBELIUM) | Microsoft Security Insider",
          "url": "https://www.microsoft.com/en-us/security/security-insider/threat-landscape/midnight-blizzard"
        }
      ]
    },
    {
      "id": "sandworm",
      "name": "Sandworm",
      "nameJa": "サンドワーム",
      "country": "ロシア",
      "countryCode": "RU",
      "attribution": "ロシア連邦軍参謀本部情報総局(GRU)特殊技術主要司令部(GTsST)第74455部隊",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Seashell Blizzard(旧称: IRIDIUM)"
        },
        {
          "vendor": "Mandiant/Google",
          "name": "APT44"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Voodoo Bear"
        },
        {
          "vendor": "Dragos",
          "name": "ELECTRUM"
        },
        {
          "vendor": "ESET",
          "name": "TeleBots / BlackEnergy Group"
        },
        {
          "vendor": "Secureworks",
          "name": "IRON VIKING"
        },
        {
          "vendor": "その他",
          "name": "Quedagh, FROZENBARENTS"
        }
      ],
      "mitre": "G0034",
      "firstSeen": "2009",
      "hook": "電力網を止めた国家のサイバー破壊工作部隊",
      "summary": "Sandwormは、ロシアGRU(参謀本部情報総局)第74455部隊に帰属するとされる破壊活動特化型の脅威アクターで、少なくとも2009年から活動しているとされる。2015年・2016年のウクライナ電力網攻撃、2017年の世界的ワイパー攻撃NotPetya、2018年平昌冬季五輪を狙ったOlympic Destroyerなど、国家間の緊張と連動した破壊的サイバー作戦を継続してきたと評価される。2020年には米司法省がGRU将校6名をこれら一連の攻撃に関与したとして起訴した。近年はMicrosoftが「Seashell Blizzard」の名称で追跡しており、傘下のサブグループによる「BadPilotキャンペーン」(2021年以降、エッジ機器の脆弱性を悪用した世界規模の初期アクセス作戦)も報告されている。2025年以降はウクライナ関連の破壊工作に加え、親ロシア派ハクティビスト(2022年創設のCyber Army of Russia Reborn=CARRなど)の創設・資金提供を支援したと評価される(なおCARRから2024年に分離したZ-Pentestは、GRUの関与から独立して活動しているとされる)。",
      "purposes": [
        "destructive",
        "espionage",
        "prepositioning",
        "surveillance"
      ],
      "sectors": [
        "エネルギー",
        "電力",
        "石油・ガス",
        "政府機関",
        "運輸・海運",
        "通信",
        "防衛産業",
        "重要インフラ全般"
      ],
      "malware": [
        "BlackEnergy",
        "Industroyer/CrashOverride",
        "Industroyer2",
        "KillDisk",
        "NotPetya",
        "Olympic Destroyer",
        "VPNFilter",
        "GreyEnergy",
        "Cyclops Blink"
      ],
      "notableOps": [
        {
          "year": "2015-2016",
          "title": "ウクライナ電力網攻撃",
          "desc": "BlackEnergyやIndustroyerを用いてウクライナの複数電力会社を攻撃し、数十万世帯規模の大規模停電を引き起こしたとされる。"
        },
        {
          "year": "2017",
          "title": "NotPetya攻撃",
          "desc": "ウクライナの会計ソフトを起点にワイパー型マルウェアNotPetyaを世界中に拡散させ、推定100億ドル規模の被害をもたらしたとされる。"
        },
        {
          "year": "2018",
          "title": "平昌五輪破壊工作(Olympic Destroyer)",
          "desc": "2018年平昌冬季五輪の開会式運営システムを標的にOlympic Destroyerで妨害し、ロシア選手団排除への報復と評価される。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "MITRE ATT&CK - Sandworm Team, G0034",
          "url": "https://attack.mitre.org/groups/G0034/"
        },
        {
          "title": "Microsoft Security Blog - The BadPilot campaign: Seashell Blizzard subgroup conducts multiyear global access operation",
          "url": "https://www.microsoft.com/en-us/security/blog/2025/02/12/the-badpilot-campaign-seashell-blizzard-subgroup-conducts-multiyear-global-access-operation/"
        },
        {
          "title": "CISA Advisory AA25-343A - Pro-Russia Hacktivists Conduct Opportunistic Attacks Against US and Global Critical Infrastructure",
          "url": "https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-343a"
        }
      ]
    },
    {
      "id": "turla",
      "name": "Turla",
      "nameJa": "トゥーラ",
      "country": "ロシア",
      "countryCode": "RU",
      "attribution": "ロシア連邦保安庁(FSB)Center 16(第16センター)配下のユニットに帰属するとされる",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Secret Blizzard(旧称 KRYPTON)"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Venomous Bear"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "UNC4210(2022年のAndromeda基盤乗っ取り活動の呼称)"
        },
        {
          "vendor": "IBM X-Force",
          "name": "ITG12"
        },
        {
          "vendor": "Symantec/Broadcom",
          "name": "Waterbug"
        },
        {
          "vendor": "Kaspersky",
          "name": "WhiteBear"
        },
        {
          "vendor": "Palo Alto Networks (Unit 42)",
          "name": "Pensive Ursa"
        },
        {
          "vendor": "その他",
          "name": "Group 88 / BELUGASTURGEON / Uroburos / Snake"
        }
      ],
      "mitre": "G0010",
      "firstSeen": "2004年(Uroburos/Snakeの開発着手は2003年末とされる)",
      "hook": "衛星回線を悪用する老舗諜報グループ",
      "summary": "Turlaは2004年頃(開発着手は2003年末)から活動するとされる、ロシア連邦保安庁(FSB)Center 16配下のユニットに帰属する老舗サイバースパイグループ。自社開発ルートキットSnake(開発名Uroburos)や、Kazuar、ComRAT、Carbon、Mosquitoなど多様な独自マルウェア群を運用する。2015年にはKasperskyが衛星インターネット回線の下り帯域を盗聴し、正規利用者のIPアドレスを乗っ取ってC2通信を隠蔽する独自手法を実証したと報告した。2023年にはCISA・FBI等の共同勧告(Operation MEDUSA)によりSnake基盤が無力化され、FSB Center 16への帰属が公式に明示された。Microsoftは同グループをSecret Blizzardと呼称し、2024年にはウクライナ軍関連端末を狙いAmadeyボット等他グループの侵入基盤を「間借り」してKazuarバックドアを展開する手口を、2025年にはモスクワ駐在の外交施設をISPレベルの中間者攻撃(AiTM)でApolloShadowマルウェアを配布する手口を報告した。標的は政府、大使館、軍事、教育・研究、製薬など50カ国以上に及ぶとされる。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "政府機関",
        "大使館・外交",
        "軍事",
        "教育・研究機関",
        "製薬"
      ],
      "malware": [
        "Snake (Uroburos)",
        "Kazuar / KazuarV2",
        "ComRAT",
        "Carbon",
        "Mosquito",
        "Gazer",
        "LightNeuron",
        "ApolloShadow",
        "Tavdig"
      ],
      "notableOps": [
        {
          "year": "2015",
          "title": "衛星インターネット回線のハイジャック",
          "desc": "Kasperskyが発見。衛星ISPの下り回線を盗聴し正規利用者のIPアドレスを乗っ取ってC2通信を隠蔽する手法を実証したとされる。"
        },
        {
          "year": "2023",
          "title": "Operation MEDUSA(Snake基盤の摘発)",
          "desc": "FBI主導の共同作戦でSnake/Uroburosのピアツーピア感染網を無力化。CISA/FBI等がFSB Center 16への帰属を公式に勧告として公表。"
        },
        {
          "year": "2025",
          "title": "モスクワ駐在大使館へのAiTM攻撃(ApolloShadow)",
          "desc": "Microsoftが報告。ロシア国内ISP経由の中間者攻撃で偽Kaspersky証明書を用いApolloShadowマルウェアを展開したとされる。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Turla, Secret Blizzard, Snake, Uroburos, Group G0010 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0010/"
        },
        {
          "title": "Frozen in transit: Secret Blizzard's AiTM campaign against diplomats | Microsoft Security Blog",
          "url": "https://www.microsoft.com/en-us/security/blog/2025/07/31/frozen-in-transit-secret-blizzards-aitm-campaign-against-diplomats/"
        },
        {
          "title": "Frequent freeloader part II: Russian actor Secret Blizzard using tools of other groups to attack Ukraine | Microsoft Security Blog",
          "url": "https://www.microsoft.com/en-us/security/blog/2024/12/11/frequent-freeloader-part-ii-russian-actor-secret-blizzard-using-tools-of-other-groups-to-attack-ukraine/"
        },
        {
          "title": "Satellite Turla: still alive and hiding in the sky | Kaspersky official blog",
          "url": "https://www.kaspersky.com/blog/satellite-turla/15098/"
        }
      ]
    },
    {
      "id": "gamaredon-group",
      "name": "Gamaredon Group",
      "nameJa": "ガマレドン・グループ",
      "country": "ロシア",
      "countryCode": "RU",
      "attribution": "モスクワのロシア連邦保安庁(FSB)第18情報セキュリティセンター(Center 18)の指揮下、占領下クリミア(セヴァストポリ)を拠点に活動しているとされ、2021年11月にウクライナ政府(SSU)が公式に帰属を発表し、複数のグループ構成員の実名も公表した。",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Aqua Blizzard(旧ACTINIUM)"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Primitive Bear"
        },
        {
          "vendor": "Symantec",
          "name": "Shuckworm"
        },
        {
          "vendor": "Palo Alto Networks(Unit42)",
          "name": "Trident Ursa"
        },
        {
          "vendor": "SecureWorks",
          "name": "IRON TILDEN"
        },
        {
          "vendor": "Cloudflare",
          "name": "NastyShrew"
        }
      ],
      "mitre": "G0047",
      "firstSeen": "2013",
      "hook": "クリミア発、FSBの大量フィッシング部隊",
      "summary": "Gamaredon(ガマレドン)は2013年以降、ウクライナの政府機関・軍・法執行機関・NGOなどを標的に大量のスピアフィッシング攻撃を展開してきたロシア系脅威アクター。ウクライナ保安庁(SSU)は2021年、本グループをモスクワのFSB第18情報セキュリティセンター(Center 18)の指揮下にあると評価し、占領下クリミアのセヴァストポリを拠点とすると公表し、構成員の実名も明らかにした。従来は情報窃取・偵察が主目的とされてきたが、2025年にはESETによりTurla(同じくFSB系とされる)との連携が確認され、GamaredonがスピアフィッシングとリムーバブルドライブのLNKファイルで初期侵入を果たした後、TurlaがKazuarバックドアを展開する分業体制が明らかになった。さらに2025年11月にはWinRARの脆弱性(CVE-2025-8088)を悪用しGamaWiperと呼ばれるワイパーマルウェアを配布する初の破壊的攻撃が確認されたとされ、単なる諜報活動を超えた活動へのエスカレーションが指摘されている。",
      "purposes": [
        "espionage",
        "surveillance",
        "destructive"
      ],
      "sectors": [
        "政府機関",
        "軍事",
        "法執行機関",
        "司法",
        "非営利団体(NGO)",
        "ジャーナリスト/報道機関"
      ],
      "malware": [
        "Pteranodon",
        "PowerPunch",
        "QuietSieve",
        "GammaLoad",
        "GammaSteel",
        "Remcos",
        "PteroGraphin",
        "PteroOdd",
        "PteroPaste",
        "PteroCache/PteroDee",
        "PteroSetup",
        "GamaWiper"
      ],
      "notableOps": [
        {
          "year": "2021-2025",
          "title": "対ウクライナ大量スピアフィッシング作戦",
          "desc": "政府機関・軍・法執行機関を標的に、2025年だけで35件の異なるスピアフィッシングキャンペーンを実施し数百~数千台を侵害したとされる。"
        },
        {
          "year": "2025",
          "title": "TurlaへのKazuarバックドア展開支援(2025年2~6月)",
          "desc": "GamaredonのツールPteroGraphin/PteroOdd/PteroPasteを用い、同じFSB系とされるTurlaのKazuar v2/v3バックドアを高価値端末に展開する分業が確認された。"
        },
        {
          "year": "2025年11月",
          "title": "WinRAR脆弱性(CVE-2025-8088)悪用による破壊的攻撃",
          "desc": "WinRARのパストラバーサル脆弱性を悪用しHTAダウンローダーをStartupフォルダに設置、ウクライナの標的に対しGamaWiperと呼ばれるワイパーマルウェアを展開し、スパイ活動から初の破壊的攻撃へ踏み込んだとされる。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Gamaredon Group, Group G0047 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0047/"
        },
        {
          "title": "Gamaredon in 2025: Leveraging tunnels, workers, dead drops, and new alliances (ESET WeLiveSecurity)",
          "url": "https://www.welivesecurity.com/en/eset-research/gamaredon-2025-leveraging-tunnels-workers-dead-drops-new-alliances/"
        },
        {
          "title": "ESET Research: Russian FSB-linked Gamaredon and Turla team up to target high-profile Ukrainian entities",
          "url": "https://www.eset.com/us/about/newsroom/research/eset-research-gamaredon-and-turla-target-high-profile-ukrainian-entities/"
        }
      ]
    },
    {
      "id": "lazarus-group",
      "name": "Lazarus Group",
      "nameJa": "ラザルス・グループ",
      "country": "北朝鮮",
      "countryCode": "KP",
      "attribution": "朝鮮民主主義人民共和国 偵察総局(RGB)第3局 Lab 110(旧称Bureau 121)",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Diamond Sleet(旧ZINC)"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Labyrinth Chollima"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "TEMP.Hermit"
        },
        {
          "vendor": "米国政府(DHS/FBI)",
          "name": "HIDDEN COBRA"
        },
        {
          "vendor": "その他",
          "name": "Guardians of Peace、UNC577"
        }
      ],
      "mitre": "G0032",
      "firstSeen": "2009年頃",
      "hook": "北朝鮮の国家ハッキング複合体、その中核",
      "summary": "Lazarus Groupは、北朝鮮の偵察総局(RGB)第3局傘下のLab 110(旧Bureau 121)を出自とするとされる、北朝鮮関連サイバー活動全般を指す傘称。2009年頃から活動が確認されており、諜報・破壊工作・金銭窃取を横断的に行う点が特徴とされる。Mandiantの2022年3月時点の評価では、この傘称の中核はTEMP.Hermitと呼ばれるクラスターであり、金融特化のAPT38、諜報からランサムウェアまで手掛けるAndariel(2024年にAPT45として格上げ)は、いずれもLab 110傘下の別個の下位グループとして並列に位置づけられる(APT38がAPT45の下位という関係ではない)。ただしこの組織図モデルは継続的に更新されており、上記はその時点での対応関係である。Sony Pictures Entertainment攻撃(2014年)、Bangladesh Bank SWIFT不正送金事件(2016年、未遂含め約10億ドル・実損約8100万ドル)、WannaCryランサムウェア(2017年、150カ国・20万台以上に被害)などで知られる。近年は暗号資産取引所やDeFiプラットフォームへの攻撃、AppleJeus等のトロイの木馬化した仮想通貨アプリを用いた資金窃取に注力しているとされ、米財務省・司法省による制裁・起訴の対象ともなっている。",
      "purposes": [
        "espionage",
        "financial",
        "destructive",
        "ip-theft"
      ],
      "sectors": [
        "金融機関・暗号資産取引所",
        "国防産業",
        "政府機関",
        "エンターテインメント・メディア",
        "重要インフラ(電力等)",
        "航空宇宙"
      ],
      "malware": [
        "AppleJeus",
        "Bankshot",
        "BLINDINGCAN",
        "Dacls",
        "Dtrack",
        "DRATzarus",
        "WannaCry"
      ],
      "notableOps": [
        {
          "year": "2014",
          "title": "Sony Pictures Entertainment攻撃",
          "desc": "映画「The Interview」公開に反発したとされる破壊的ワイパー攻撃と情報漏えい。Guardians of Peace名義で実行"
        },
        {
          "year": "2016",
          "title": "Bangladesh Bank(SWIFT)不正送金事件",
          "desc": "SWIFTネットワーク経由で約10億ドルの不正送金を試み、うち約8100万ドルがフィリピン経由で窃取された"
        },
        {
          "year": "2017",
          "title": "WannaCryランサムウェア",
          "desc": "SMB脆弱性(EternalBlue)を悪用し150カ国・20万台以上のシステムに感染、英NHS等に甚大な被害"
        }
      ],
      "relatedApt": [
        "APT38",
        "APT45"
      ],
      "sources": [
        {
          "title": "Lazarus Group, G0032 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0032/"
        },
        {
          "title": "Labyrinth Chollima Adversary Profile | CrowdStrike",
          "url": "https://www.crowdstrike.com/en-us/adversaries/labyrinth-chollima/"
        },
        {
          "title": "Not So Lazarus: Mapping DPRK Cyber Threat Groups to Government Organizations | Mandiant | Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/mapping-dprk-groups-to-government/"
        },
        {
          "title": "APT45: North Korea's Digital Military Machine | Mandiant | Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/apt45-north-korea-digital-military-machine"
        },
        {
          "title": "AppleJeus: Analysis of North Korea's Cryptocurrency Malware | CISA",
          "url": "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-048a"
        }
      ]
    },
    {
      "id": "kimsuky",
      "name": "Kimsuky",
      "nameJa": "キムスキー",
      "country": "北朝鮮",
      "countryCode": "KP",
      "attribution": "朝鮮人民軍偵察総局(RGB)配下とされる(「Room 35」との関連も指摘される)",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Emerald Sleet(旧THALLIUM)"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Velvet Chollima"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "APT43"
        },
        {
          "vendor": "Proofpoint",
          "name": "TA427"
        },
        {
          "vendor": "Symantec/Broadcom",
          "name": "Springtail"
        },
        {
          "vendor": "PwC",
          "name": "Black Banshee"
        },
        {
          "vendor": "Trend Micro",
          "name": "Earth Kumiho"
        },
        {
          "vendor": "Cloudflare",
          "name": "PatheticSlug"
        }
      ],
      "mitre": "G0094",
      "firstSeen": "2012年頃",
      "hook": "脱北者と専門家を狙う北朝鮮の諜報機関",
      "summary": "Kimsukyは少なくとも2012年から活動する北朝鮮拠点のサイバー諜報グループで、朝鮮人民軍偵察総局(RGB)の配下にあるとされる。主目的は金銭ではなく情報収集であり、朝鮮半島情勢・核政策・対北制裁に関する外交政策情報をピョンヤン指導部に提供することにあると評価される。標的は当初、韓国政府機関やシンクタンク、有識者だったが、その後、国連機関、日米欧露の政府・教育・メディア・研究機関にも拡大した。特に、北朝鮮の人権問題に取り組む脱北者・活動家支援団体や、北朝鮮専門家に対する偵察・スピアフィッシングが継続的に確認されている。手口は記者や研究者を装ったなりすましメールによるラポール構築型スピアフィッシングが中心で、近年は商用LLMを用いた脆弱性調査・偵察・フィッシング文面作成、さらにPowerShellを標的自身に実行させる手口(ClickFix類似)も確認されている。Mandiantは同グループをAPT43として、CrowdStrikeはVelvet Chollimaとして追跡しており、複数ベンダーが北朝鮮国家との関連を高い確度で評価している。",
      "purposes": [
        "espionage",
        "surveillance",
        "ip-theft"
      ],
      "sectors": [
        "政府",
        "シンクタンク・NGO",
        "学術・研究機関",
        "メディア",
        "国連等国際機関",
        "脱北者・人権活動家支援団体",
        "エネルギー(原子力)"
      ],
      "malware": [
        "AppleSeed",
        "BabyShark",
        "KGH_SPY",
        "TRANSLATEXT",
        "Troll Stealer",
        "GoBear",
        "Gomir",
        "QuasarRAT",
        "forceCopy"
      ],
      "notableOps": [
        {
          "year": "2014",
          "title": "韓国水力原子力(KHNP)への攻撃",
          "desc": "韓国の原子力発電運営会社に対する侵入・情報窃取が確認され、Kimsukyの関与が評価された。"
        },
        {
          "year": "2018",
          "title": "Operation STOLEN PENCIL",
          "desc": "学術機関を標的にした資格情報窃取キャンペーンで、大学関係者らを狙った。"
        },
        {
          "year": "2025-2026",
          "title": "QRコード悪用スピアフィッシング(FBI警告)",
          "desc": "外交顧問を装い、朝鮮半島専門家やシンクタンク幹部にQRコード付きアンケートを送るフィッシングをFBIが確認・警告した。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Kimsuky, Group G0094 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0094/"
        },
        {
          "title": "East Asia Threat Actors: Same Targets, New Playbooks | Microsoft Security Insider",
          "url": "https://www.microsoft.com/en-us/security/security-insider/threat-landscape/east-asia-threat-actors-employ-unique-methods"
        },
        {
          "title": "Assessed Cyber Structure and Alignments of North Korea in 2023 | Mandiant, Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/north-korea-cyber-structure-alignment-2023"
        }
      ]
    },
    {
      "id": "muddywater",
      "name": "MuddyWater",
      "nameJa": "マディウォーター",
      "country": "イラン",
      "countryCode": "IR",
      "attribution": "イラン情報安全省(MOIS: Ministry of Intelligence and Security)傘下の組織とされる。2022年2月、米FBI・CISA・NSA・米サイバー司令部(USCYBERCOM)隷下Cyber National Mission Force(CNMF)および英NCSC-UKが共同勧告(AA22-055A)でMOIS配下と公式に帰属評価を発表",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Mango Sandstorm(旧称MERCURY)"
        },
        {
          "vendor": "Mandiant/Google",
          "name": "TEMP.Zagros"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Static Kitten"
        },
        {
          "vendor": "Trend Micro",
          "name": "Earth Vetala"
        },
        {
          "vendor": "Symantec/Broadcom",
          "name": "Seedworm"
        },
        {
          "vendor": "Proofpoint",
          "name": "TA450"
        },
        {
          "vendor": "Palo Alto Networks Unit 42",
          "name": "Boggy Serpens"
        },
        {
          "vendor": "Recorded Future",
          "name": "GreenGolf"
        },
        {
          "vendor": "Secureworks",
          "name": "COBALT ULSTER"
        }
      ],
      "mitre": "G0069",
      "firstSeen": "2017年頃",
      "hook": "中東の政府・通信網を狙うイランの影の水脈",
      "summary": "MuddyWaterはイラン情報安全省(MOIS)傘下の組織とされるサイバースパイ活動グループで、少なくとも2017年頃から活動が確認されている。2022年2月、米FBI・CISA・NSA・米サイバー司令部(CNMF)と英NCSC-UKによる共同勧告(AA22-055A)でMOIS配下と公式に帰属評価された。中東(アラブ首長国連邦、サウジアラビア等)を中心に、アジア・アフリカ・欧州・北米の政府機関、通信、地方自治体、金融、防衛、石油・天然ガス分野を標的とする。スピアフィッシングや公開脆弱性の悪用、正規リモート管理ツール(RMM)の悪用を多用し、盗んだデータやアクセス権をイラン政府や他の攻撃者と共有する役割も担うとされる。2026年にはStarlinkなど商用衛星インターネットをC2通信に利用する活動や、Group-IBが報告したOperation Olalampo(新型マルウェアCHAR、GhostFetch、GhostBackDoor、HTTP_VIPを用いたMENA地域への攻撃)が確認されている。",
      "purposes": [
        "espionage",
        "destructive",
        "surveillance"
      ],
      "sectors": [
        "政府機関",
        "通信",
        "地方自治体",
        "金融",
        "防衛",
        "石油・天然ガス"
      ],
      "malware": [
        "POWERSTATS",
        "PowGoop",
        "Small Sieve",
        "Canopy(STARWHALE)",
        "Mori",
        "RustyWater",
        "CHAR",
        "GhostFetch",
        "GhostBackDoor",
        "HTTP_VIP"
      ],
      "notableOps": [
        {
          "year": "2022",
          "title": "CISA/FBI/NSA/米サイバー司令部・NCSC-UK共同勧告(AA22-055A)",
          "desc": "MOIS配下との公式帰属を発表。PowGoop、Small Sieve、Canopy(Starwhale)、Mori、POWERSTATS等の使用を確認"
        },
        {
          "year": "2026年1-2月",
          "title": "Operation Olalampo",
          "desc": "Group-IBが報告。MENA地域のエネルギー・海運・通信・重要インフラを標的に、Rustバックドア「CHAR」やTelegram C2等の新型マルウェアを展開、AI支援開発の痕跡も確認"
        },
        {
          "year": "2025年末-2026年",
          "title": "Starlink等商用衛星インターネットのC2悪用",
          "desc": "商用衛星インターネットサービスを指令統制(C2)通信のインフラとして利用する活動が確認された"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "MuddyWater, Earth Vetala, MERCURY, Static Kitten, Seedworm, TEMP.Zagros, Mango Sandstorm, TA450, MuddyKrill, Group G0069 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0069/"
        },
        {
          "title": "Operation Olalampo: Inside MuddyWater's Latest Campaign | Group-IB Blog",
          "url": "https://www.group-ib.com/blog/muddywater-operation-olalampo/"
        },
        {
          "title": "Iranian Government-Sponsored Actors Conduct Cyber Operations Against Global Government and Commercial Networks | CISA (AA22-055A)",
          "url": "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a"
        }
      ]
    },
    {
      "id": "sidewinder",
      "name": "SideWinder",
      "nameJa": "サイドワインダー",
      "country": "インド",
      "countryCode": "IN",
      "attribution": "インド政府/情報機関との関連が疑われる(non-state/private contractorの可能性も指摘されるが公式な軍・情報機関の特定部隊への断定はされていない)",
      "vendorNames": [
        {
          "vendor": "MITRE",
          "name": "Sidewinder / G0121"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Razor Tiger"
        },
        {
          "vendor": "Kaspersky",
          "name": "SideWinder"
        },
        {
          "vendor": "Group-IB / 中国系ベンダー",
          "name": "APT-C-17"
        },
        {
          "vendor": "その他別称",
          "name": "T-APT-04, Rattlesnake, Baby Elephant, Hardcore Nationalist, APT-Q-39, Leafperforator(Broadcom)"
        }
      ],
      "mitre": "G0121",
      "firstSeen": "2012年(MITRE ATT&CK評価。CrowdStrikeのRazor Tiger名では2018年初頭以降の活動として記録)",
      "hook": "パキスタン中国を狙う南アジアの毒蛇",
      "summary": "SideWinder(別名Rattlesnake、T-APT-04、Razor Tiger、APT-C-17、Baby Elephant)は、2012年頃から活動するとされるインド発の脅威アクターグループ。MITRE ATT&CKではG0121として登録され、インド国家の情報収集優先事項に沿った活動とCrowdStrikeは評価している。伝統的にパキスタン・中国・ネパル・アフガニスタンの軍・政府機関を主要標的としてきたが、2024年後半以降はスリランカ、バングラデシュに加え、南アジアの原子力発電施設、海事・港湾インフラ、ジブチやエジプトの物流企業、中東・アフリカの外交機関にまで標的を拡大しているとされる。攻撃はCVE-2017-11882等のMicrosoft Office脆弱性を悪用したスピアフィッシング(LNK/RTF/DOCXファイル)から始まり、多段階のJavaScript/.NETローダーを経て、モジュール型インプラント「StealerBot」を展開し、キーロギング・スクリーンショット取得・認証情報窃取・ファイル窃取を行う。検知後5時間以内にマルウェアを改変するなど、高速な適応・回避能力を持つ点が特徴とされる。5大国(中国・ロシア・北朝鮮・イラン・米国)系グループとは異なる「非5大国」の代表例として位置づけられる。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "政府",
        "軍事",
        "外交",
        "海事・物流",
        "原子力エネルギー",
        "金融",
        "通信",
        "IT・コンサルティング",
        "教育(大学)"
      ],
      "malware": [
        "StealerBot",
        "Koadic",
        "ModuleInstaller",
        "Backdoor Loader (JetCfg.dll / policymanager.dll等)",
        "App.dll"
      ],
      "notableOps": [
        {
          "year": "2017-2024",
          "title": "パキスタン・中国軍/政府への継続的スピアフィッシング攻撃",
          "desc": "CVE-2017-11882等のOffice脆弱性を悪用したLNK/RTF/DOCXファイルで軍・政府機関を標的とし、StealerBotで機密文書や認証情報を窃取したとされる。"
        },
        {
          "year": "2024年後半",
          "title": "南アジア原子力・海事セクターへの標的拡大",
          "desc": "Kaspersky GReATが、南アジアの原子力発電施設や港湾当局・海運会社を狙う攻撃を新たに確認したと報告。検知後5時間以内にマルウェアを改変する高速な適応力を見せたとされる。"
        },
        {
          "year": "2025年",
          "title": "中東・アフリカへの地理的拡大",
          "desc": "エジプトの港湾当局、ジブチの物流企業、南アジアの原子力規制機関などを同時並行で標的にするキャンペーンが観測されたとされる。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Sidewinder, T-APT-04, Rattlesnake, Group G0121 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0121/"
        },
        {
          "title": "SideWinder APT's post-exploitation framework analysis | Securelist",
          "url": "https://securelist.com/sidewinder-apt/114089/"
        },
        {
          "title": "SideWinder APT updates its toolset and targets nuclear sector | Securelist",
          "url": "https://securelist.com/sidewinder-apt-updates-its-toolset-and-targets-nuclear-sector/115847/"
        },
        {
          "title": "Razor Tiger Adversary Profile | CrowdStrike",
          "url": "https://www.crowdstrike.com/en-us/adversaries/razor-tiger/"
        },
        {
          "title": "SideWinder Threat Group: Maritime and Nuclear Sectors at Risk with Updated Toolset | Picus Security",
          "url": "https://www.picussecurity.com/resource/blog/sidewinder-threat-group"
        }
      ]
    },
    {
      "id": "equation-group",
      "name": "Equation Group",
      "nameJa": "イクエーション・グループ",
      "country": "未公表(米国とされる)",
      "countryCode": "US",
      "attribution": "米国家安全保障局(NSA)特別入手作戦部(TAO)との関連が広く報じられるが、米国政府による公式な自認・公表はなく、Kaspersky等の技術的傍証(NSAのコードネーム「STRAITBIZARRE」に酷似する文字列「STRAITACID」「STRAITSHOOTER」がマルウェア内から発見された点〔完全一致ではなく類似性に基づく傍証〕、開発者の稼働時間帯が米国東部標準時の平日日中に集中している点等)に基づく評価にとどまる",
      "vendorNames": [
        {
          "vendor": "MITRE ATT&CK",
          "name": "Equation (G0020)"
        },
        {
          "vendor": "Malpedia/一部研究者",
          "name": "Tilded Team / EQGRP"
        },
        {
          "vendor": "中国系ベンダー(奇安信/360等)",
          "name": "APT-C-40"
        }
      ],
      "mitre": "G0020",
      "firstSeen": "2001年頃(確認されたマルウェアの最古のコンパイル日は2002年、C2ドメイン登録は2001年8月)",
      "hook": "HDDを書き換える最高峰の技術力",
      "summary": "2015年2月、KasperskyがメキシコでのSecurity Analyst Summitで発表した、史上最も技術的に高度とされるサイバースパイ集団。2001年頃から活動し、少なくとも42カ国・500件以上への感染が確認された。西部デジタルやSeagate、東芝など主要メーカーのハードディスクドライブのファームウェアを書き換えて自己を永続化させる能力(GrayFish等)を持ち、物理フォーマットやOS再インストールでも駆除できない点が際立つ。マルウェア内部から発見されたNSAのコードネーム「STRAITBIZARRE」に酷似する文字列(完全一致ではなく類似性に基づく傍証)や、開発者の稼働パターンが米国東部標準時の平日日中に集中していたことから、米NSAのTAO(Tailored Access Operations)部門との関連が広く報じられているが、これはあくまで技術的傍証に基づく評価であり、米政府による公式な認定ではない。2008年に確認されたマルウェア「Fanny」はStuxnetと同一のゼロデイ脆弱性やコードコンポーネントを共有しており、両者が同一勢力または極めて密接な協力関係にあったとKasperskyは分析している。2016年には「Shadow Brokers」を名乗る集団がEquation Group由来とされるハッキングツール群(ETERNALBLUEを含む)を窃取・公開し、これが2017年のWannaCryおよびNotPetya攻撃の踏み台となった。",
      "purposes": [
        "espionage",
        "surveillance",
        "prepositioning"
      ],
      "sectors": [
        "政府・外交機関",
        "通信",
        "航空宇宙",
        "エネルギー",
        "原子力研究",
        "石油・ガス",
        "軍事",
        "ナノテクノロジー",
        "イスラム活動家・学者",
        "マスメディア",
        "金融"
      ],
      "malware": [
        "EquationLaser",
        "EquationDrug",
        "GrayFish",
        "DoubleFantasy",
        "TripleFantasy",
        "Fanny",
        "DoublePulsar",
        "DarkPulsar",
        "GROK",
        "OddJob"
      ],
      "notableOps": [
        {
          "year": "2008",
          "title": "Fanny(スタックスネット関連ワーム)",
          "desc": "USB経由でエアギャップ環境をマッピングするワームで、Stuxnetより先にゼロデイ脆弱性2件を使用。Stuxnetとのコード共有が確認された"
        },
        {
          "year": "2015",
          "title": "Kasperskyによる暴露とHDDファームウェア改変の発覚",
          "desc": "GrayFish等が西部デジタル・Seagate・東芝など主要ベンダーのHDDファームウェアを書き換え、駆除不能な永続化を実現していたことが判明"
        },
        {
          "year": "2016-2017",
          "title": "Shadow Brokersによるツール流出とEternalBlue悪用",
          "desc": "窃取・公開されたEquation Group製ツールに含まれるEternalBlueが、2017年のWannaCryおよびNotPetya攻撃で悪用され世界的被害をもたらした"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Equation: The Death Star of Malware Galaxy - Securelist (Kaspersky)",
          "url": "https://securelist.com/equation-the-death-star-of-malware-galaxy/68750/"
        },
        {
          "title": "Equation, Group G0020 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0020/"
        },
        {
          "title": "Equation Group (Threat Actor) - Malpedia",
          "url": "https://malpedia.caad.fkie.fraunhofer.de/actor/equation_group"
        },
        {
          "title": "Equation Group - Wikipedia",
          "url": "https://en.wikipedia.org/wiki/Equation_Group"
        },
        {
          "title": "The Shadow Brokers - Wikipedia",
          "url": "https://en.wikipedia.org/wiki/The_Shadow_Brokers"
        }
      ]
    },
    {
      "id": "fin7",
      "name": "FIN7",
      "nameJa": "FIN7(フィンセブン)",
      "country": "犯罪組織(国家帰属なし)",
      "countryCode": "CR",
      "attribution": "国家帰属なし。主にロシア・ウクライナの人物で構成される金銭目的の犯罪組織とされる(フロント企業Combi Securityがロシア・ウクライナ・ウズベキスタン等で要員を募集していたとされる)",
      "vendorNames": [
        {
          "vendor": "CrowdStrike",
          "name": "CARBON SPIDER"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "FIN7"
        },
        {
          "vendor": "Microsoft",
          "name": "Sangria Tempest(旧称 ELBRUS)"
        },
        {
          "vendor": "IBM X-Force",
          "name": "ITG14"
        },
        {
          "vendor": "SecureWorks",
          "name": "GOLD NIAGARA"
        }
      ],
      "mitre": "G0046",
      "firstSeen": "2013年(2015年からFireEye/Mandiantが「FIN7」として追跡)",
      "hook": "郵送BadUSBを操る金融犯罪集団",
      "summary": "FIN7は2013年頃から活動する金銭目的の犯罪グループで、主にロシア・ウクライナの人物で構成され国家帰属はないとされる。Carbanak Groupとも呼ばれ、当初はPOSマルウェア(CARBANAK、GRIFFON等)でレストランやホスピタリティ業界からクレジットカード情報を大量窃取した。2018年に主要メンバー3名がウクライナ等で逮捕・起訴され服役したが、組織は活動を継続。2020年以降はビッグゲームハンティングへ転換し、テディベアやギフト箱を装ってBadUSBデバイスを標的企業へ郵送しランサムウェアへつなげる手口(FBIが警告)や、自前のRaaS「DarkSide」「BlackMatter」の運用への関与が指摘されている。近年はPOWERPLANTバックドアやソフトウェアサプライチェーン侵害、マルバタイジングなど初期侵入手法を多様化させ、対象業界も金融・医療・クラウド・防衛など広範囲に拡大していると評価されている。",
      "purposes": [
        "financial",
        "prepositioning"
      ],
      "sectors": [
        "小売",
        "飲食・接客(レストラン/ホスピタリティ)",
        "金融サービス",
        "医療機器",
        "クラウドサービス",
        "メディア",
        "食品飲料",
        "運輸",
        "医薬品",
        "公共事業",
        "ソフトウェア/コンサルティング",
        "防衛"
      ],
      "malware": [
        "CARBANAK",
        "DICELOADER (Lizar)",
        "POWERPLANT",
        "GRIFFON",
        "BATELEUR",
        "HALFBAKED",
        "Cobalt Strike",
        "SQLRat",
        "JSS Loader",
        "STONEBOAT",
        "DAVESHELL",
        "BEAKDROP",
        "CROWVIEW",
        "DarkSide(ランサムウェア、関与が指摘される)",
        "BlackMatter(ランサムウェア、関与が指摘される)"
      ],
      "notableOps": [
        {
          "year": "2015-2018",
          "title": "POS侵害による大規模カード情報窃取",
          "desc": "レストラン・ホスピタリティ・小売業を中心に100以上の米国企業に侵入し、POSマルウェアCarbanak/GRIFFON等で大量のクレジットカード情報を窃取したとされる。"
        },
        {
          "year": "2020-2022",
          "title": "BadUSB(郵送USB)キャンペーン",
          "desc": "テディベアやAmazon/HHSを装ったギフト箱にBadUSBデバイスを同梱して米企業へ郵送し、差し込ませてDICELOADER等を展開しランサムウェア攻撃へつなげたとされ、FBIが警告を発出した。"
        },
        {
          "year": "2020-2022",
          "title": "ランサムウェア(DarkSide/BlackMatter)への関与",
          "desc": "自らのRaaSであるDarkSideを立ち上げ、その後継としてBlackMatterを運用したとされ、コード署名証明書の重複などからMandiantやCrowdStrikeが関連を指摘している。"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "FIN7, GOLD NIAGARA, ITG14, Carbon Spider, ELBRUS, Sangria Tempest, Group G0046 | MITRE ATT&CK",
          "url": "https://attack.mitre.org/groups/G0046/"
        },
        {
          "title": "On the Hunt for FIN7: Pursuing an Enigmatic and Evasive Global Criminal Operation | Mandiant | Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/fin7-pursuing-an-enigmatic-and-evasive-global-criminal-operation"
        },
        {
          "title": "FIN7 Power Hour: Adversary Archaeology and the Evolution of FIN7 | Mandiant | Google Cloud Blog",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/evolution-of-fin7"
        },
        {
          "title": "FBI: FIN7 hackers target US companies with BadUSB devices to install ransomware | The Record",
          "url": "https://therecord.media/fbi-fin7-hackers-target-us-companies-with-badusb-devices-to-install-ransomware"
        },
        {
          "title": "CARBON SPIDER Embraces Big Game Hunting, Part 1 | CrowdStrike",
          "url": "https://www.crowdstrike.com/en-us/blog/carbon-spider-embraces-big-game-hunting-part-1/"
        }
      ]
    },
    {
      "id": "scattered-spider",
      "name": "Scattered Spider",
      "nameJa": "スキャッタード・スパイダー",
      "country": "犯罪組織(国家帰属なし)",
      "countryCode": "CR",
      "attribution": "国家非帰属。英語圏(主に米国・英国)の若年層(10代後半〜20代前半)からなる緩やかな犯罪コレクティブ「The Com」の一部とされる",
      "vendorNames": [
        {
          "vendor": "Microsoft",
          "name": "Octo Tempest（旧Storm-0875）"
        },
        {
          "vendor": "Mandiant/Google Cloud",
          "name": "UNC3944"
        },
        {
          "vendor": "MITRE ATT&CK",
          "name": "Roasted 0ktapus"
        },
        {
          "vendor": "CrowdStrike",
          "name": "Scattered Spider（動物名だが本人呼称と一致）"
        },
        {
          "vendor": "その他",
          "name": "Scatter Swine、Muddled Libra、0ktapus"
        }
      ],
      "mitre": "G1015",
      "firstSeen": "2022年5月頃",
      "hook": "若者集団が仕掛けるヘルプデスク詐欺",
      "summary": "Scattered Spiderは2022年5月頃から活動が確認されている、米国・英国出身の10代後半〜20代前半のネイティブ英語話者を中心とする緩やかなサイバー犯罪グループとされる。より大きな犯罪コミュニティ「The Com」の一部を構成するとされ、明確な指揮系統を持たない流動的な連携体とみられる。最大の特徴は高度なソーシャルエンジニアリングで、企業のヘルプデスクやコールセンターに電話をかけ、標的従業員になりすましてMFAリセットやパスワード変更を依頼し、初期侵入や権限昇格を行う手口を多用する。SIMスワップやSMSフィッシング(AiTM)、プッシュ爆撃も併用する。当初はCRM・BPO・通信業界の認証情報窃取やSIMスワップが中心だったが、2023年以降ゲーミング・ホスピタリティ・小売・製造・金融・航空など対象業種を拡大し、ALPHV/BlackCatやDragonForceなどのランサムウェアを用いたデータ窃取・恐喝、VMware ESXi破壊行為にも関与したとされる。2024年以降は複数の主要メンバーが米英で逮捕・訴追されている。",
      "purposes": [
        "financial",
        "destructive"
      ],
      "sectors": [
        "通信",
        "BPO/CRM",
        "ゲーミング・ホスピタリティ",
        "小売",
        "製造",
        "金融",
        "航空",
        "保険",
        "MSP"
      ],
      "malware": [
        "ALPHV/BlackCat（ランサムウェア）",
        "DragonForce（ランサムウェア）",
        "Mimikatz",
        "LaZagne",
        "Raccoon Stealer",
        "AADInternals",
        "ngrok/Chisel/RSOCX（トンネリングツール）",
        "Impacket"
      ],
      "notableOps": [
        {
          "year": "2023",
          "title": "MGM Resorts / Caesars Entertainment攻撃",
          "desc": "LinkedIn等で得た従業員情報を使いヘルプデスクへ電話しOktaアクセスを奪取、ALPHV/BlackCatランサムウェアを展開しMGMのESXi基盤等を暗号化"
        },
        {
          "year": "2024-2026",
          "title": "主要メンバーの逮捕・訴追",
          "desc": "英国の17歳少年やRemington Ogletree(19歳)らが逮捕され、2026年にはエストニア系米国人の容疑者がフィンランドで拘束・米国へ引き渡された"
        },
        {
          "year": "2025",
          "title": "英国小売業へのDragonForceランサムウェア攻撃",
          "desc": "英国大手小売企業(M&S、Co-op等)がScattered Spiderの手口に一致する攻撃で侵害されDragonForceランサムウェアが展開されたが、Mandiant/Googleは可視性不足を理由に正式な帰属は控えているとされる"
        }
      ],
      "relatedApt": [],
      "sources": [
        {
          "title": "Scattered Spider, Roasted 0ktapus, Octo Tempest, Storm-0875, UNC3944 | MITRE ATT&CK G1015",
          "url": "https://attack.mitre.org/groups/G1015/"
        },
        {
          "title": "Protecting customers from Octo Tempest attacks across multiple industries | Microsoft Security Blog",
          "url": "https://www.microsoft.com/en-us/security/blog/2025/07/16/protecting-customers-from-octo-tempest-attacks-across-multiple-industries/"
        },
        {
          "title": "UNC3944 Targets SaaS Applications | Google Cloud Blog (Mandiant)",
          "url": "https://cloud.google.com/blog/topics/threat-intelligence/unc3944-targets-saas-applications"
        },
        {
          "title": "CISA and Partners Release Updated Advisory on Scattered Spider Group",
          "url": "https://www.cisa.gov/news-events/alerts/2025/07/29/cisa-and-partners-release-updated-advisory-scattered-spider-group"
        }
      ]
    }
  ]
};
