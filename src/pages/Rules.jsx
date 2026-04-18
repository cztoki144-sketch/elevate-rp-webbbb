import React, { useEffect, useRef } from "react";
import "../styles/rules.css";
import cayo from "../assets/cayo-perico.png";

const TOC = [
  { id: "intro", title: "Úvod" },
  { id: "game", title: "Herní pravidla" },
  { id: "gang", title: "Faction RP (GangRP)" },
  { id: "illegal", title: "Nelegální pravidla" },
];

export default function Rules() {
  const mainRef = useRef(null);

  useEffect(() => {
    const links = Array.from(document.querySelectorAll(".rules-toc a"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = "#" + e.target.id;
          const link = links.find((l) => l.getAttribute("href") === id);
          if (!link) return;
          if (e.isIntersecting) link.classList.add("active");
          else link.classList.remove("active");
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="rules-page">
      <aside className="rules-toc">
        <h2>Pravidla</h2>
        <nav>
          {TOC.map((s) => (
            <a key={s.id} href={"#" + s.id}>
              {s.title}
            </a>
          ))}
        </nav>
      </aside>

      <main className="rules-main" ref={mainRef}>
        {/* HERO */}
        <section id="intro" className="hero">
          <h1>Pravidla ElevateRP</h1>
          <p>
            Kompletní pravidla komunity — čtěte je pečlivě. Neznalost pravidel
            neomlouvá.
          </p>
        </section>

        {/* HERNÍ PRAVIDLA */}
        <section id="game" className="rule-card fade-in">
          <CardHead title="Herní pravidla" />
          <div className="card-grid">
            <Card title="RP │ Roleplay">
              <P>
                Hraní vytvořené postavy v uměle vytvořeném herním světě. Hráč je
                v podstatě herec, který se snaží co nejlépe reagovat na situace
                jako ve skutečnosti.
              </P>
            </Card>

            <Card title="/ME">
              <P>
                Tento příkaz slouží k vyjádření činnosti, kterou hra přímo
                neumožňuje animací. Popisujeme ji vždy ve třetí osobě.
              </P>
              <H4>Příklad</H4>
              <List>
                <li>/me vytahuje z kapsy doklady a podává je</li>
                <li>/me dává zbraň na popruh</li>
              </List>
            </Card>

            <Card title="/DO">
              <P>
                Slouží k popisu vykonání činnosti s očekáváním reakce nějakého
                hráče.
              </P>
              <H4>Příklad</H4>
              <List>
                <li>/do je pod vlivem alkoholu?</li>
                <li>/do vidí lokální zranění?</li>
                <li>/do papíry leží na stole</li>
              </List>
              <List>
                <li>Do commandu je zakázáno lhát.</li>
                <li>
                  Do commandu je zakázáno psát své myšlenky a pocity.
                </li>
              </List>
            </Card>

            <Card title="/TRY">
              <P>
                Slouží k náhodnému určení ANO či NE a používá se jako doplněk k
                příkazu /do.
              </P>
              <P>/try nevyužívejte při RP injuries.</P>
            </Card>

            <Card title="KOS | Kill On Sight">
              <P>Zabití na první pohled bez předešlého RP.</P>
            </Card>

            <Card title="Metagaming">
              <P>
                Veškeré informace, které se hráč dozví v OOC a použije je v IC,
                se berou jako metagaming.
              </P>
            </Card>

            <Card title="Nabádání k Metagamingu">
              <P>
                Veškeré vypisování OOC informací jinému hráči, který nebyl
                přítomen v RP akci, se bere jako porušení pravidla.
              </P>
              <H4>Příklad</H4>
              <P>
                Zažádáš o CK na určitého hráče, CK ti je schválené a ty mu
                začneš vypisovat „Těš se“ a podobně.
              </P>
            </Card>

            <Card title="Mixing">
              <P>
                Mluvení či psaní OOC věcí do IC nebo používání slovníku, kterému
                charakter neodpovídá.
              </P>
              <H4>Příklad</H4>
              <List>
                <li>Pojď na piškord</li>
                <li>Píšu bohům</li>
                <li>Banánové / Bahamové ostrovy</li>
              </List>
            </Card>

            <Card title="Mixing mezi postavami">
              <P>
                Jakékoliv předávání majetku a informací z postavy na postavu je
                zakázáno.
              </P>
            </Card>

            <Card title="Poznávání hráčů">
              <P>
                Hráče nelze automaticky poznat podle hlasu, vozidla, oblečení
                nebo vzhledu, pokud mezi vámi neproběhla dostatečná herní
                interakce.
              </P>
              <P>
                K rozpoznání postavy je nutné provést tuto interakci
                prostřednictvím příkazu /do.
              </P>
            </Card>

            <Card title="PowerGaming">
              <P>
                Zákaz provádění úkonů, které nelze v reálném světě vykonat.
                Například zvedání kamionu, létání, držení příliš věcí v
                inventáři a podobně.
              </P>
              <List>
                <li>
                  Členové frakcí nesmí nutit ostatní hráče do nereálných
                  situací.
                </li>
                <li>
                  Nesmí se používat RP akce, které nejsou technicky možné nebo
                  zneužívají mezery v systému.
                </li>
              </List>
              <H4>Realistické používání zbraní</H4>
              <List>
                <li>
                  Zbraně musí být používány uvěřitelně a adekvátně situaci.
                </li>
                <li>Přestřelky nesmí být vyvolávány kvůli maličkostem.</li>
                <li>
                  Každý výstřel musí mít RP zdůvodnění. Ne OOC důvod typu „porušil
                  pravidlo, tak ho zastřelím“, jinak se jedná o porušení pravidla
                  KOS.
                </li>
              </List>
            </Card>

            <Card title="Fear Roleplay">
              <P>
                Hráči jsou povinni brát v úvahu, že jejich postava má přirozený
                strach o svůj život. Toto pravidlo platí i v situacích, kdy svým
                jednáním ohrožují život jiné blízké postavy. Například přítele,
                člena rodiny nebo kolegy.
              </P>
              <P>
                Patří sem například GunFear, DogFear, JailFear, PDFear nebo
                JobFear.
              </P>
              <P>
                HoodFear znamená, že tvoje postava musí mít strach a respekt vůči
                gangům na jejich území.
              </P>
              <P>
                Výjimka: gang, nelegální organizace na svém území, policejní
                akce, psychicky nemocná osoba a podobně. Schválení pouze pomocí
                ticketu.
              </P>
            </Card>

            <Card title="Gross RP">
              <P>
                Gross RP označuje extrémní nebo odpudivý roleplay, jako je
                například kanibalismus, nekrofilie, mučení a podobné tématiky.
              </P>
              <P>Tento typ roleplaye je povolen pouze za těchto podmínek:</P>
              <List>
                <li>
                  Všichni zúčastnění hráči musí předem výslovně souhlasit s
                  průběhem RP.
                </li>
                <li>
                  Pokud během RP kdokoliv uzná, že situace přesahuje jeho
                  komfortní hranice, má právo svůj souhlas kdykoliv odvolat.
                </li>
                <li>
                  RP se v takovém případě musí ihned ukončit, nebo se hráč může z
                  interakce stáhnout.
                </li>
                <li>
                  Pokud se do scény zapojí nový hráč, musí souhlas s Gross RP
                  potvrdit také, jinak v něm nelze pokračovat.
                </li>
                <li>Mučení nesmí způsobit nucené ukončení postavy.</li>
                <li>
                  Gross RP nesmí zanechat trvalé následky ani viditelná zranění,
                  pokud nejde o schválený CK.
                </li>
              </List>
            </Card>

            <Card title="Water Evading">
              <P>
                Je zakázáno unikat státním složkám tím způsobem, že skočíte do
                vody a bezdůvodně plavete co nejdál od břehu, nebo použijete
                vodní skútr k útěku na otevřený oceán.
              </P>
              <P>
                Toto pravidlo se nevztahuje na uzavřené vodní plochy, jako jsou
                rybníky, řeky nebo jezera, například Alamo Sea.
              </P>
            </Card>

            <Card title="CombatLog">
              <P>
                Je zakázáno se odpojovat ze hry během probíhající RP akce za
                účelem vyhnutí se trestu, ztráty majetku nebo jakémukoliv
                následku plynoucímu z roleplaye.
              </P>
              <List>
                <li>
                  V případě pádu hry nebo restartu serveru je hráč povinen
                  navázat na předchozí RP situaci.
                </li>
                <li>
                  Pokud se po opětovném připojení nacházíte na jiném místě nebo
                  došlo k jinému problému, je nutné vytvořit report a vyčkat na
                  rozhodnutí člena admin týmu.
                </li>
                <li>
                  Není dovoleno jednostranně přeskočit RP akci bez schválení
                  členem admin týmu.
                </li>
                <li>
                  Minimální doba, po kterou musíte zůstat připojeni po skončení
                  RP akce, je 15 minut.
                </li>
                <li>
                  Po jejím uplynutí se lze ze hry odpojit, pokud akce již
                  skutečně skončila.
                </li>
              </List>
            </Card>

            <Card title="Combat Comeback">
              <P>
                Je zakázáno vracet se do stejné RP akce po respawnu.
              </P>
              <P>
                Například pokud zemřete při přestřelce, nesmíte se po respawnu
                vrátit zpět na místo a pokračovat v boji.
              </P>
              <P>
                Veškerá zranění, která postava utrpí, musí být odehrána včetně
                lékařského ošetření a následné rekonvalescence, tedy období, kdy
                se postava zotavuje a není schopna plně fungovat.
              </P>
              <P>
                Ignorování zranění a okamžité pokračování v běžné činnosti není
                přípustné.
              </P>
            </Card>

            <Card title="Cop Baiting">
              <P>
                Zakázáno je bezdůvodné provokování policie. Hráč musí hrát strach
                ze státních složek, vyjma situací, kdy je provokace součástí RP,
                například odvádění pozornosti při nelegální činnosti.
              </P>
            </Card>

            <Card title="Passive RP">
              <P>
                Je potřeba si uvědomit, že veřejné prostory jsou plné lidí, a to
                hlavně přes den. Los Santos je několika milionové město, i když
                zrovna kolem vás nejsou žádní hráči ani NPC.
              </P>
              <P>
                Na veřejných místech ve městech i na venkově se nachází spousta
                lidí jako v reálném Los Angeles. Veřejné objekty jsou pokryté
                kamerovým systémem.
              </P>
              <P>
                Passive se hlavně vztahuje na město, dálnice, stanice státních
                složek, bary, dílny, banky, obchody a turistická místa nebo
                trasy, například Sandy Shores, Grapeseed a Paleto Bay.
              </P>
            </Card>

            <Card title="Pointless Shooting">
              <P>
                Je přísně zakázáno zahajovat střelbu bez odpovídajícího a
                realistického RP důvodu.
              </P>
              <P>
                Střelba musí být vždy logickým vyústěním předchozí roleplay
                situace a nesmí sloužit pouze k rychlému ukončení interakce,
                získání výhody nebo zábavě.
              </P>
              <P>
                Hráč je povinen před použitím střelné zbraně využít adekvátní RP
                prostředky, tedy komunikaci, výhrůžky a eskalaci konfliktu.
                Okamžitá střelba bez předchozí interakce je považována za
                porušení pravidla.
              </P>
              <H4>Je zakázáno zejména</H4>
              <List>
                <li>
                  Střelba ze sportovních či jiných vozidel s minimálními nebo
                  žádnými reálnými střeleckými otvory.
                </li>
                <li>
                  Střelba přes konstrukce vozidla, které by v reálném světě
                  neumožňovaly bezpečné a efektivní použití zbraně.
                </li>
                <li>
                  Využívání kamery třetí osoby k nepřirozenému zaměřování z
                  vozidla.
                </li>
              </List>
              <P>
                Střelba z vozidla je povolena pouze tehdy, pokud je technicky a
                realisticky proveditelná, například přes stažené okno, otevřené
                dveře, odpovídající typ vozidla a pozici postavy.
              </P>
              <P>Střelba z helikoptéry je zakázána.</P>
              <P>
                To, že u sebe máte zbraň, není vhodný důvod ke střelbě.
              </P>
            </Card>

            <Card title="Non-RP Injuries">
              <P>
                Zakázáno je nereálné RP zranění nebo ignorování skutečných
                zranění.
              </P>
              <P>
                Například pokud se při nehodě ve vysoké rychlosti nezraníte a
                chováte se, jako by se nic nestalo, nebo když vás postřelí a
                RPíte jen odřené koleno.
              </P>
            </Card>

            <Card title="Non-RP Driving">
              <P>
                Zakázána je jízda sportovními a supersportovními vozy do kopců,
                hor a náročného terénu s velkým převýšením.
              </P>
              <P>
                Vozidla s vyšším podvozkem mohou jezdit po polních cestách,
                rovné travnaté ploše a mírně zvlněném terénu, ale ne po skalách
                nebo strmých svazích.
              </P>
              <P>
                Také je zakázáno jezdit s vozidlem bez dvou a více pneumatik.
              </P>
            </Card>

            <Card title="NVL | Not Valuing Your Life">
              <P>
                Během RP chraňte život své postavy a vyhýbejte se zbytečným
                rizikům, abyste zajistili realistické a věrohodné hraní.
              </P>
              <P>
                Například běhání po dálnici, běh ke střelbě a podobně.
              </P>
            </Card>

            <Card title="VDM | Vehicle Deathmatch">
              <P>
                Bezdůvodné narážení do okolních hráčů, vozidel a objektů. Použití
                auta jako zbraně a podobně.
              </P>
            </Card>

            <Card title="Car Jacking (Ninja)">
              <P>
                Je zakázáno krást NPC nebo hráčská vozidla bez důvodu v rámci RP.
              </P>
              <P>
                Krádež vozidel EMS, PD, SD, FD a podobných složek je povolena
                pouze po schválení ticketu pro RP akci.
              </P>
            </Card>

            <Card title="Pravidlo inventáře">
              <P>
                Veškeré věci, které má hráč u sebe, musí RPit. Není možné, aby
                hráč RPil, že má nějaký předmět mimo svůj inventář, i přesto, že
                fyzicky item je pořád v inventáři.
              </P>
            </Card>

            <Card title="Ass Pulling">
              <P>
                Ass Pulling je tahání nadměrných věcí bez předešlého RP,
                například dlouhé zbraně nebo kanystr.
              </P>
              <P>
                Není možné, aby se hráči pohybovali v krátkém tričku se zbraní
                na zádech. V tomto okamžiku je důležité si zaRPit popruh,
                popřípadě nosit vestu.
              </P>
            </Card>

            <Card title="/911">
              <P>
                Při střelném nebo bodném zranění, pokud hráč upadne do PK nebo
                vyhledá EMS podle pravidla Non-RP Injuries, musí zavolat PD nebo
                SD přes /911 a počkat na jejich příjezd.
              </P>
              <P>
                Pokud do 15 minut nikdo nepřijede, může hráč EMS opustit bez
                dalšího RP.
              </P>
              <P>
                Při ilegální činnosti, kde se za normálních okolností vyskytují
                lidé, je potřeba také nahlásit situaci přes /911 s popisem osob,
                auta, směru, počtu a podobně.
              </P>
            </Card>

            <Card title="MultiChar">
              <P>
                Hráč nesmí RPit dvě postavy ve stejné nebo propojené frakci,
                například LSPD, LSSD, EMS a podobně.
              </P>
              <List>
                <li>
                  Nelze RPit postavy ve dvou různých státních složkách současně.
                </li>
                <li>
                  Není dovoleno RPit vlastní příbuzné postavy nebo potomky.
                </li>
                <li>Hráč nesmí znát svou druhou nebo předchozí postavu.</li>
                <li>
                  Není možné mít jednu postavu v ozbrojené legální složce a
                  druhou v nelegální organizaci.
                </li>
              </List>
            </Card>

            <Card title="Pravidlo bydlení">
              <P>
                Každá postava musí dle pravidel mít trvalé bydliště, tedy platit
                někde nájem či vlastnit nemovitost, hotel, motel a podobně.
              </P>
              <P>
                Netýká se to bezdomovců, kteří musí mít předešlé schválení v
                ticketu.
              </P>
            </Card>

            <Card title="Looting">
              <P>
                Je přísně zakázáno okrádat hráče bez adekvátního důvodu.
                Například vidíš někoho na zemi, přijdeš k němu, okradeš ho a
                utečeš.
              </P>
              <P>
                Je zakázáno jakýmkoliv způsobem okrádat státní složky.
              </P>
            </Card>

            <Card title="Fail RP">
              <P>
                Jakýkoliv pokus o záměrné narušení nebo trollení RP je zakázán,
                a to jak jednotlivci, tak skupinami či frakcemi.
              </P>
              <List>
                <li>
                  Nedostatečná úroveň kvality RP. Hráč by se měl během RP chovat
                  tak, aby dodržoval určitou kvalitu roleplaye.
                </li>
                <li>
                  Zákaz vytváření nereálně vypadajících českých nebo slovenských
                  postav. Týká se hlavně jmen.
                </li>
                <li>
                  Je přísně zakázáno RPit jakoukoli bombu či výbušninu bez
                  předchozího schválení v admin ticketu.
                </li>
                <li>
                  Zákaz pouštění videí z prostředí Grand Theft Auto 5 a FiveM.
                </li>
                <li>
                  Zákaz používání N-wordů, s výjimkou komunikace mezi gangy bez
                  českých výrazů, například negr nebo negře, vždy bez
                  rasistického kontextu.
                </li>
                <li>
                  Zákaz zneužívání a bugování animací či herních mechanik pro
                  vlastní prospěch, například bunny hopping, spam punching nebo
                  combat rolling.
                </li>
                <li>
                  Korupce musí být schválena v admin ticketu, jinak trest
                  smazáním postavy a dlouhým banem.
                </li>
                <li>
                  Zákaz vydávat se za státní složku bez schválení. Pro výjimky je
                  nutné podat ticket s plánem akce a mít nad akcí dohled.
                </li>
                <li>
                  Nouzový signál může být vyslán pouze pokud je reálná šance na
                  pomoc od místních obyvatel.
                </li>
                <li>
                  Je zakázáno úmyslně kazit hru ostatním nebo je provokovat k
                  vyvolání OOC konfliktů.
                </li>
                <li>
                  Při /carry a podobných příkazech je nutné vše zaRPit pomocí
                  /me a /do. Běhání, skákání a podobné úkony jsou zakázány.
                </li>
                <li>Zákaz RPení pasivních a NPC rukojmí.</li>
                <li>
                  Převážení hráče v dead screenu přes /carry do nemocnice je
                  zakázáno, pokud jsou dostupní EMS. Po doběhnutí respawnu lze
                  využít.
                </li>
                <li>
                  Zákaz prodeje drog z motorek. Je nutné nejdříve sesednout.
                </li>
                <li>Zákaz kempění NPC určených pro ilegální činnosti.</li>
                <li>
                  Veškeré kamery musí být zaRPeny pomocí propů.
                </li>
                <li>
                  Zákaz napadání hráčů na policejních stanicích bez RP
                  odůvodnění.
                </li>
                <li>
                  Zákaz krádeže policejních vozidel bez schválené RP akce v
                  ticketu.
                </li>
                <li>
                  Zákaz nošení policejních uniforem hráči, kteří neRPí danou
                  státní složku.
                </li>
                <li>
                  Po dobu únosu musíte unesenému poskytovat jídlo a pití, v
                  opačném případě porušujete pravidlo KOS.
                </li>
                <li>
                  Před focením screenshotů musíte situaci zaRPit nebo mít
                  minimálně v ruce telefon.
                </li>
                <li>
                  Zákaz odstraňování sériových čísel z jakýchkoliv zbraní.
                </li>
                <li>
                  Zákaz používání vest bez odpovídajícího oblečení, výjimku tvoří
                  podkošilové vesty státních složek.
                </li>
                <li>
                  Zákaz používání fotek a videí z jiných serverů, včetně
                  profilových fotek.
                </li>
                <li>Zákaz využívání animací při PVP.</li>
                <li>
                  Při honičce se státní složkou nesmíte zaparkovat vozidlo do
                  garáže do doby, než uběhne 10 minut.
                </li>
                <li>
                  Při opravě zbraní je nutné vše řádně zaRPit.
                </li>
                <li>
                  Zákaz používání loveckých zbraní k PVP, výjimkou je obrana při
                  lovu.
                </li>
                <li>
                  Lovení zvířat je povoleno pouze s loveckými zbraněmi.
                </li>
                <li>
                  Zákaz bindování příkazů /me a /do, například /me bere a pokládá.
                </li>
              </List>
            </Card>

            <Card title="Únos">
              <P>
                Maximální doba pro únos je 2 hodiny. Pro zvýšení času si hráč
                nebo frakce musí zažádat v admin ticketu. Pokud s tím druhá
                strana nesouhlasí, musí mít adekvátní důvod a následně se akce
                doRPí.
              </P>
              <P>
                Únos musí mít jasný RP důvod, například dluhy, konflikt,
                varování, zrada, obchodní spor nebo nelegální lokace.
              </P>
              <P>
                Zákaz okrádání nebo unášení lidí při heistech z tabletu,
                popřípadě veřejný crafting.
              </P>
              <H4>Během únosu</H4>
              <List>
                <li>
                  Unešená osoba musí mít dostatek jídla a pití, její úmrtí z
                  důvodu dehydratace nebo nedostatku jídla se bere jako KOS.
                </li>
                <li>
                  Nesmíte po osobě vymáhat peníze či majetek, pokud se nejedná o
                  interní CK nelegální frakce.
                </li>
                <li>Únos nesmí být proveden v interiéru na portu.</li>
                <li>
                  Při únosu je omezeno výkupné na 30 000 dolarů na osobu. Platí i
                  při vykrádání a podobně.
                </li>
              </List>
            </Card>

            <Card title="Pravidlo vykrádání">
              <P>
                Na každé vykrádačce musíte počkat 10 minut do příjezdu státních
                složek. Pokud do 10 minut nepřijedou, můžete uniknout.
              </P>
              <List>
                <li>
                  Zákaz používat jednostopá vozidla, tedy motorky, kola a buggy,
                  při vykrádání obchodu. Motorky můžete mít nachystané pár bloků
                  vedle.
                </li>
                <li>
                  Je zakázáno mít dohodnutého rukojmího. Maximální vyžadovaná
                  částka za jednoho rukojmí je 25 000 dolarů.
                </li>
              </List>
            </Card>

            <Card title="CPZ">
              <P>
                Maximální doba pobytu v CPZ jsou 2 hodiny reálného času.
              </P>
              <P>
                Výjimka platí při řešení soudem či prodloužení skrz výslechy a
                podobně.
              </P>
            </Card>

            <Card title="PK | Player Kill">
              <P>
                Aktuální zabití postavy. Postava si po upadnutí do death screenu
                nic nepamatuje.
              </P>
              <P>
                Během stavu PK, tedy death screenu, hráč nemůže užívat voice
                chat, chat v telefonu a podobně.
              </P>
            </Card>

            <Card title="Revenge Kill">
              <P>
                Po PK, tedy death screenu, není možné se ihned po respawnu
                mstít.
              </P>
              <P>
                Hráč musí adekvátně RPit zranění dle předchozí RP akce.
                Minimální čekací doba před pomstou je 24 hodin. Neplatí pro
                Faction RP.
              </P>
              <P>
                Pokud vás daný hráč znovu napadne, můžete se bránit.
              </P>
              <P>Toto pravidlo na Cayo Pericu neplatí.</P>
            </Card>

            <Card title="CK | Character Kill">
              <P>Trvalé usmrcení postavy.</P>
              <List>
                <li>
                  Po provedení CK je nutné podat support ticket s místem činu,
                  fotografií, časem, způsobem a příčinou smrti, popisem
                  manipulace s tělem a žádostí o vymazání postavy. Žádost musí
                  obsahovat pádný důvod.
                </li>
                <li>
                  Jail CK je automaticky schváleno, pokud má hráč v rejstříku
                  přes 100 let.
                </li>
                <li>Jail CK může udělit DOJ, tedy soud.</li>
                <li>Situační CK schvaluje admin tým v ticketu.</li>
                <li>
                  Návrat do stejné nelegální frakce nebo gangu po CK je možný až
                  po 14 dnech. Bez schválení ticketu nelze spolupracovat ani
                  navazovat vztahy.
                </li>
                <li>
                  Návrat do legální frakce po CK je možný po 14 dnech. Platí i
                  při vyhození.
                </li>
                <li>
                  Cizí člen nelegální frakce může být na pozemku vaší frakce
                  CKnut bez schválení, například při raidu či špehování, pokud na
                  pozemek vstoupí dobrovolně a nebyl k tomu násilně donucen.
                </li>
                <li>CK se vyhlašuje formátem: CK - jméno postavy.</li>
              </List>
            </Card>

            <Card title="Vesty">
              <P>
                Hráč používající item Těžká vesta musí mít tuto vestu i
                vizuálně na sobě jako součást oděvu.
              </P>
              <P>Toto pravidlo se nevztahuje na Lehkou vestu.</P>
            </Card>

            <Card title="Cayo Perico">
              <P>Pravidlo KOSu zde neplatí.</P>
              <P>
                Na pravidla jako PowerGaming, Non-RP Injuries a Combat Log bude
                více trestáno.
              </P>
              <P>
                Při nelegální činnosti jste povinní nosit vestu.
              </P>

              <div className="cayo-wrap" style={{ marginTop: "18px" }}>
                <img src={cayo} alt="Cayo Perico" />
                <div className="cayo-caption">Mapa Cayo Perico</div>
              </div>
            </Card>
          </div>
        </section>

        {/* FACTION RP */}
        <section id="gang" className="rule-card fade-in">
          <CardHead title="Faction RP (GangRP)" />
          <div className="card-grid">
            <Card title="Obecná pravidla">
              <List>
                <li>Je zakázáno campit na střeše a střílet z ní.</li>
                <li>Je zakázáno okrádat při pull-up nebo drive-by.</li>
                <li>
                  Je zakázáno jakkoliv provokovat jiný gang na jejich území.
                </li>
                <li>Je zakázáno používat vysílačky.</li>
                <li>Je zakázáno okrádat gangy po PK.</li>
                <li>
                  Je zakázáno spolupracovat s jinou nelegální frakcí.
                </li>
                <li>
                  Pokud budete provádět Walk-up, Drive-by nebo Traffic-by, vždy
                  bude řečena message před zabitím určité osoby. Pokud tomu tak
                  nebude, platí pravidlo KOS. Neplatí pro Pull-up.
                </li>
                <li>Revenge Kill platí po uplynuté hodině.</li>
                <li>Střelba je vždy poslední možnost.</li>
              </List>
            </Card>

            <Card title="Počty hráčů">
              <List>
                <li>Tvorba gangu: 5 hráčů</li>
                <li>Maximální počet: 20 hráčů včetně pedů</li>
                <li>Drive-by: 2 hráči, maximálně 2 vozidla, 8 hráčů</li>
                <li>Pull-up: 3 hráči</li>
              </List>
            </Card>

            <Card title="Oblečení a chování">
              <P>
                Gangy se reprezentují svou barvou. Nemusíte být celý v barvě,
                stačí mít něco, čím značíte barvu vašeho gangu, například šátky,
                čepice a podobně.
              </P>
              <P>
                Jsou povolené veškeré zbraně, ke kterým se dostanete, a jakékoliv
                doplňky kromě tlumiče.
              </P>
              <H4>Volnočasové aktivity</H4>
              <List>
                <li>Jízda na BMX</li>
                <li>Jízda na skateboardu</li>
                <li>Graffiti</li>
                <li>Jízda ve vozidle</li>
                <li>Hraní basketbalu</li>
              </List>
              <P>
                Jezděte v levnějších autech, ideálně sedany, muscle auty,
                lowridery a kola. Upřednostňujte chůzi.
              </P>
            </Card>
          </div>
        </section>

        {/* NELEGÁLNÍ PRAVIDLA */}
        <section id="illegal" className="rule-card fade-in">
          <CardHead title="Nelegální pravidla" />
          <div className="card-grid">
            <Card title="Obecná pravidla">
              <List>
                <li>
                  KOS platí pouze na lokacích jako krádež auta, prodej klenotů a
                  podobně.
                </li>
                <li>
                  Na nelegálních územích, jako jsou drogové lokace, předěl nebo
                  Cayo Perico, KOS neplatí, pokud jste ve značné přesile.
                </li>
                <li>
                  Je zakázáno RPit více než jednu nelegální frakci. Nelze být
                  například v mafii a zároveň v cartelu.
                </li>
                <li>
                  Přechod mezi nelegálními frakcemi je zakázán. Výjimka pouze
                  přes ticket.
                </li>
                <li>
                  Je zakázáno spolupracovat ve dvou a více nelegálních frakcích
                  při nelegálních činnostech. Výjimka pouze přes ticket.
                </li>
                <li>
                  Frakce musí respektovat cizí teritorium a nepohybovat se tam
                  bez důvodu, například vila nebo podnik.
                </li>
                <li>
                  Pokud frakce vstoupí na cizí teritorium, musí mít adekvátní RP
                  důvod, například vyjednávání, konflikt nebo obchod.
                </li>
                <li>
                  Používání masek je povoleno, ale musí mít logický důvod,
                  například nelegální činnost, hledání policií nebo nebezpečí.
                </li>
                <li>Masky nelze používat 24/7 bezhlavě.</li>
                <li>
                  Zranění musí být zpracováno kvalitně, tedy lékař a bolest.
                </li>
                <li>
                  Frakční vozidla se nesmí propůjčovat nebo prodávat náhodným
                  hráčům nebo lidem mimo frakci.
                </li>
                <li>
                  Vozidla se využívají pro účely frakce, ne jako taxi nebo troll
                  dopravní prostředek.
                </li>
                <li>
                  Každá frakce je zodpovědná za své členy a jejich znalost
                  pravidel. I jeden člen dokáže zničit frakci. Vedení je
                  zodpovědné za to, že členové byli poučeni o pravidlech a mají
                  je znát.
                </li>
                <li>
                  Je přísně zakázán Chain-shooting, tedy není povoleno ihned po
                  přestřelce vyvolávat další konflikt bez RP oddechu.
                </li>
                <li>Každá frakce musí mít přehlednou hierarchii.</li>
                <li>
                  Je povinnost hlásit velké akce, například Hlavní banka.
                </li>
              </List>
            </Card>

            <Card title="Pravidla pro obchod">
              <List>
                <li>
                  Obchod se zbraněmi, drogami a dalšími nelegálními věcmi musí
                  být řízen ve hře a roleplayi.
                </li>
                <li>
                  Je zakázáno prodávat extrémně levné nebo nesmyslné ceny jen za
                  účelem výhody.
                </li>
                <li>
                  Domluvy mezi frakcemi musí být přehledné a logické.
                </li>
              </List>
            </Card>

            <Card title="Roleplay a chování">
              <List>
                <li>
                  Zákaz pointless shooting. Střelba musí mít smysluplný RP
                  důvod.
                </li>
                <li>
                  Žádné dlouhé zbraně na veřejnosti nebo u obydlených domů bez
                  důvodu. Využívejte opuštěné lokace nebo noční hodiny.
                </li>
                <li>
                  Únosy musí být plně RPeny. Nestačí jen /carry, nutné je použít
                  i /me, /do a podobně.
                </li>
                <li>Při únosu musíte používat vhodná vozidla.</li>
                <li>
                  Passive RP je povinné i pro nelegální frakce.
                </li>
              </List>
            </Card>

            <Card title="Frakční pravidla">
              <List>
                <li>
                  Frakční Discord: Je zakázáno RPit nebo nutit přístup na cizí
                  frakční Discord.
                </li>
                <li>
                  Spojenectví mezi frakcemi je dovoleno jen za účelem obchodu
                  nebo výměny informací, ne kvůli zničení jiné frakce. Možnost
                  výjimky přes ticket.
                </li>
                <li>
                  Snitchování, tedy donášení, je přísně zakázáno, jak na vlastní,
                  tak cizí frakce.
                </li>
                <li>
                  Výjimkou je snitch pro státní složky, kde musí mít jasný a
                  obhájitelný RP důvod, ale je vhodné mít založený ticket na
                  informátora.
                </li>
                <li>
                  Zákaz používat jednostopá vozidla, tedy motorky, kola a buggy,
                  při vykrádání obchodu. Motorky můžete mít nachystané pár bloků
                  vedle.
                </li>
              </List>
            </Card>

            <Card title="Character Kill">
              <List>
                <li>
                  Vstupem do nelegální frakce automaticky schvalujete CK.
                </li>
                <li>
                  Boss frakce může udělit CK členům bez schválení.
                </li>
                <li>
                  CK lze udělit hráči na sídle frakce, například vila, pokud je
                  přítomen boss. Výjimka: státní složky.
                </li>
                <li>
                  Nelze udělit CK na nelegálních lokacích bez schválení nebo
                  osobního souhlasu.
                </li>
              </List>
            </Card>

            <Card title="Korupce">
              <List>
                <li>
                  Korupční RP všech státních složek musí být schváleno přes
                  ticket.
                </li>
                <li>
                  Je zakázáno mít nelegální postavu a zároveň být u státní
                  složky.
                </li>
              </List>
            </Card>

            <Card title="Konflikty">
              <P>Konflikty mezi frakcemi se mají řešit:</P>
              <List>
                <li>Vyjednáváním</li>
                <li>Schůzkami</li>
                <li>Ultimáty</li>
                <li>Ekonomickým tlakem</li>
              </List>
              <P>Střelba je až poslední možnost, ne první.</P>
            </Card>

            <Card title="Počty hráčů">
              <P>
                Nelegální organizace mají omezený počet na 20 lidí plus možnost
                výjimky o dalších 5 při žádosti do ticketu a vysoké aktivitě.
              </P>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Malé pomocné komponenty ---------- */

function CardHead({ title }) {
  return (
    <div className="card-head">
      <h2>{title}</h2>
      <div className="underline" />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="subcard">
      <div className="subcard-head">
        <h3>{title}</h3>
      </div>
      <div className="subcard-body">{children}</div>
    </div>
  );
}

function P({ children }) {
  return <p className="p">{children}</p>;
}

function H4({ children }) {
  return <h4 className="h4">{children}</h4>;
}

function List({ children }) {
  return <ul className="list">{children}</ul>;
}