// ---------- i18n: Dutch as a second language. English text is the key; anything unknown stays English. ----------
const NL = new Map([
  // resources, tabs, levels, seasons
  [`Wood`, `Hout`], [`Stone`, `Steen`], [`Food`, `Voedsel`], [`Grain`, `Graan`], [`Honey`, `Honing`], [`Wool`, `Wol`], [`Cloth`, `Stof`], [`Bricks`, `Bakstenen`], [`Cider`, `Cider`], [`Coins`, `Munten`],
  [`Village`, `Dorp`], [`Materials`, `Grondstof`], [`Decor`, `Sfeer`], [`Camp`, `Kamp`], [`Hamlet`, `Gehucht`], [`Town`, `Stad`], [`Harbour Town`, `Havenstad`],
  [`Spring`, `Lente`], [`Summer`, `Zomer`], [`Autumn`, `Herfst`], [`Winter`, `Winter`], [`Bumblenook`, `Bumblenook`],
  // buildings
  [`Village Green`, `Dorpsplein`], [`The heart of the village. Villagers bring their harvest here.`, `Het hart van het dorp. Hier brengen dorpelingen hun oogst naartoe.`],
  [`Cottage`, `Huisje`], [`A snug home for 3 villagers. More beds bring new settlers.`, `Een knus thuis voor 3 dorpelingen. Meer bedden trekt nieuwe bewoners aan.`],
  [`Storehouse`, `Opslagschuur`], [`An extra drop-off point. Put one near your workplaces to shorten the walk.`, `Een extra inleverpunt. Zet er een bij je werkplekken, dan lopen dorpelingen minder ver.`],
  [`Well`, `Waterput`], [`Fresh water in the middle of the village. A real boost to happiness.`, `Vers water midden in het dorp. Geeft flink wat geluk.`],
  [`Market`, `Markt`], [`Trade goods for coins and back. With a merchant, every morning is market day.`, `Ruil goederen voor munten en andersom. Met een koopman is het elke ochtend marktdag.`],
  [`Lighthouse`, `Vuurtoren`], [`The pride of Bumblenook. Must stand close to the water.`, `De trots van Bumblenook. Moet dicht bij het water staan.`],
  [`Forager's Hut`, `Plukkershut`], [`Foragers pick berries from bushes nearby. The berries grow back by themselves.`, `Plukkers halen bessen van struiken in de buurt. De bessen groeien vanzelf weer aan.`],
  [`Fishing Hut`, `Vissershut`], [`Fishers cast from the shore. Must stand close to the water.`, `Vissers hengelen vanaf de kust. Moet dicht bij het water staan.`],
  [`Farm`, `Boerderij`], [`Farmers grow grain on the field. The bakery turns grain into bread.`, `Boeren telen graan op de akker. De bakkerij maakt er brood van.`],
  [`Bakery`, `Bakkerij`], [`A baker turns 3 grain into 7 food. Fresh bread makes everyone happy.`, `Een bakker maakt van 3 graan 7 voedsel. Vers brood maakt iedereen blij.`],
  [`Windmill`, `Molen`], [`Grinds the grain finer: every batch of bread gives 11 food instead of 7.`, `Maalt het graan fijner: elke bakbeurt levert 11 voedsel in plaats van 7.`],
  [`Apiary`, `Bijenstal`], [`The beekeeper collects honey. Twice as much with 3 flower beds nearby.`, `De imker oogst honing. Dubbel zoveel met 3 bloemperken in de buurt.`],
  [`Lumber Hut`, `Houthakkershut`], [`Woodcutters fell grown trees nearby and plant a sapling in their place.`, `Houthakkers kappen volgroeide bomen in de buurt en planten er een boompje voor terug.`],
  [`Quarry Hut`, `Steenhouwerij`], [`Stonecutters break up rocks nearby. Without rocks they work slower at the hut.`, `Steenhouwers hakken rotsen in de buurt klein. Zonder rotsen werken ze trager bij de hut.`],
  [`Sapling`, `Boompje`], [`Plant a young tree for free. It can be felled once it has grown.`, `Plant gratis een jong boompje. Als het volgroeid is, kan het gekapt worden.`],
  [`Path`, `Pad`], [`Villagers walk faster on paths. Drag to lay a whole stretch.`, `Dorpelingen lopen sneller over paden. Sleep om een heel stuk te leggen.`],
  [`Lantern`, `Lantaarn`], [`Warm light in the evening. Adds a little happiness.`, `Warm licht in de avond. Geeft een beetje geluk.`],
  [`Flower Bed`, `Bloemperk`], [`Brightens the village and attracts bumblebees. Good for the apiary.`, `Fleurt het dorp op en lokt hommels. Goed voor de bijenstal.`],
  [`Bench`, `Bankje`], [`A place to rest with a view of the sea.`, `Even uitrusten met uitzicht op zee.`],
  [`Bumble Fountain`, `Hommelfontein`], [`A fountain topped with a golden bumblebee. Adds a lot of happiness.`, `Een fontein met een gouden hommel erop. Geeft veel geluk.`],
  [`Tavern`, `Herberg`], [`A warm place to gather after work. With an innkeeper it lifts everyone's mood.`, `Een warme plek om na het werk samen te komen. Met een waard vrolijkt het iedereen op.`],
  [`Schoolhouse`, `Schooltje`], [`With a teacher, villagers learn clever tricks and work 10% faster.`, `Met een meester leren dorpelingen slimme trucjes en werken ze 10% sneller.`],
  [`Bell Tower`, `Klokkentoren`], [`Rings in every new day. A proud landmark that adds a lot of charm.`, `Luidt elke nieuwe dag in. Een trots baken dat veel sfeer geeft.`],
  [`Harbour`, `Haven`], [`With a dockhand, a trading ship calls every morning with well-paid orders. Must stand close to the water.`, `Met een havenwerker legt elke ochtend een handelsschip aan met goedbetaalde orders. Moet dicht bij het water staan.`],
  [`Sheep Pasture`, `Schapenwei`], [`A shepherd shears the sheep for wool. The weaver turns wool into cloth.`, `Een herder scheert de schapen voor wol. De wever maakt er stof van.`],
  [`Weaver`, `Wever`], [`Weaves 2 wool into 1 cloth. Cloth keeps villagers warm and sells well.`, `Weeft van 2 wol 1 stof. Stof houdt dorpelingen warm en verkoopt goed.`],
  [`Hedge`, `Heg`], [`A tidy green hedge to frame gardens and squares.`, `Een nette groene heg om tuinen en pleinen mee af te zetten.`],
  [`Founder's Statue`, `Standbeeld van de stichter`], [`A thank-you from the villagers you helped. Adds charm.`, `Een bedankje van de dorpelingen die je hielp. Geeft sfeer.`],
  [`Academy`, `Academie`], [`Scholars gather insight. Spend it here on research that unlocks new buildings, upgrades and clever tricks.`, `Geleerden verzamelen inzicht. Besteed het hier aan onderzoek dat nieuwe gebouwen, upgrades en slimme trucs oplevert.`],
  [`Town Hall`, `Raadhuis`], [`The proud heart of a real town. Collects a little tax every morning.`, `Het trotse hart van een echte stad. Int elke ochtend een beetje belasting.`],
  [`Bathhouse`, `Badhuis`], [`A hot soak after a long day. With an attendant it makes everyone happier.`, `Een warm bad na een lange dag. Met een badmeester maakt het iedereen blijer.`],
  [`Watchtower`, `Wachttoren`], [`A watchman keeps foxes away from the sheep and warns farmers before a storm.`, `Een wachter houdt vossen bij de schapen weg en waarschuwt boeren voor storm.`],
  [`Mine`, `Mijn`], [`Miners dig stone that never runs out. Must stand at the foot of rocky ground.`, `Mijnwerkers delven steen die nooit opraakt. Moet aan de voet van rotsgrond staan.`],
  [`Brickworks`, `Steenbakkerij`], [`Fires 2 stone and 1 wood into a brick. Bricks pay for upgrades and grand buildings.`, `Bakt van 2 steen en 1 hout een baksteen. Met bakstenen betaal je upgrades en grote gebouwen.`],
  [`Orchard`, `Boomgaard`], [`Fruit pickers bring baskets of apples from spring to autumn. The trees rest in winter.`, `Fruitplukkers brengen manden appels van lente tot herfst. In de winter rusten de bomen.`],
  [`Cider Press`, `Ciderpers`], [`Presses 4 food into a jug of cider. Cider cheers the village and sells well.`, `Perst van 4 voedsel een kruik cider. Cider vrolijkt het dorp op en verkoopt goed.`],
  [`Greenhouse`, `Kas`], [`A gardener grows vegetables under glass, even in the middle of winter.`, `Een tuinier kweekt groente onder glas, zelfs midden in de winter.`],
  [`Duck Pond`, `Eendenvijver`], [`A quiet pond with reeds, lilies and a pair of ducks.`, `Een stille vijver met riet, lelies en een paar eenden.`],
  [`Gazebo`, `Prieel`], [`A shady little pavilion. A reward for exploring the whole island.`, `Een schaduwrijk paviljoentje. Een beloning voor het verkennen van het hele eiland.`],
  [`Bandstand`, `Muziekkoepel`], [`Music on the green. Festivals last half as long again.`, `Muziek op het plein. Feesten duren anderhalf keer zo lang.`],
  [`Townhouse`, `Herenhuis`], [`Three storeys: 5 beds instead of 3.`, `Drie verdiepingen: 5 bedden in plaats van 3.`],
  [`Sawmill`, `Zagerij`], [`Room for a third woodcutter, and 2 more wood per tree.`, `Plek voor een derde houthakker, en 2 extra hout per boom.`],
  [`Stoneworks`, `Steenhouwerswerf`], [`Room for a third stonecutter, and 1 more stone per trip.`, `Plek voor een derde steenhouwer, en 1 extra steen per vracht.`],
  [`Irrigated Farm`, `Bevloeide boerderij`], [`A windpump waters the field: crops grow 40% faster and yield more.`, `Een windpomp bewatert de akker: gewassen groeien 40% sneller en leveren meer op.`],
  [`Grand Bakery`, `Grote bakkerij`], [`A second oven: room for a third baker and 2 more food per batch.`, `Een tweede oven: plek voor een derde bakker en 2 extra voedsel per bakbeurt.`],
  // jobs
  [`Free villager`, `Vrije dorpeling`], [`Free (builders)`, `Vrij (bouwen mee)`], [`Woodcutter`, `Houthakker`], [`Woodcutters`, `Houthakkers`], [`Stonecutter`, `Steenhouwer`], [`Stonecutters`, `Steenhouwers`],
  [`Forager`, `Plukker`], [`Foragers`, `Plukkers`], [`Farmer`, `Boer`], [`Farmers`, `Boeren`], [`Fisher`, `Visser`], [`Fishers`, `Vissers`], [`Baker`, `Bakker`], [`Bakers`, `Bakkers`],
  [`Beekeeper`, `Imker`], [`Beekeepers`, `Imkers`], [`Merchant`, `Koopman`], [`Merchants`, `Kooplieden`], [`Innkeeper`, `Waard`], [`Innkeepers`, `Waarden`], [`Teacher`, `Meester`], [`Teachers`, `Meesters`],
  [`Shepherd`, `Herder`], [`Shepherds`, `Herders`], [`Weavers`, `Wevers`], [`Dockhand`, `Havenwerker`], [`Dockhands`, `Havenwerkers`], [`Scholar`, `Geleerde`], [`Scholars`, `Geleerden`],
  [`Miner`, `Mijnwerker`], [`Miners`, `Mijnwerkers`], [`Fruit Picker`, `Fruitplukker`], [`Fruit Pickers`, `Fruitplukkers`], [`Cider Maker`, `Cidermaker`], [`Cider Makers`, `Cidermakers`],
  [`Brickmaker`, `Steenbakker`], [`Brickmakers`, `Steenbakkers`], [`Gardener`, `Tuinier`], [`Gardeners`, `Tuiniers`], [`Bath Attendant`, `Badmeester`], [`Bath Attendants`, `Badmeesters`], [`Watchman`, `Wachter`], [`Watchmen`, `Wachters`],
  // placement
  [`Off the island`, `Buiten het eiland`], [`Can't build on water`, `Kan niet op het water`], [`Too rocky`, `Te rotsachtig`], [`Something is already here`, `Hier staat al iets`], [`A rock is in the way`, `Er ligt een rots in de weg`],
  [`An old site lies here. Tap it to explore`, `Hier ligt een oude plek. Tik erop om te verkennen`], [`Trees only grow on grass`, `Bomen groeien alleen op gras`], [`Something already grows here`, `Hier groeit al iets`], [`Too steep`, `Te steil`],
  [`Must be close to the water`, `Moet dicht bij het water staan`], [`Must stand next to rocks or rocky ground`, `Moet naast rotsen of rotsgrond staan`], [`Would block the way`, `Zou de doorgang afsluiten`],
  [`Villagers could not reach it`, `Dorpelingen kunnen er niet bij`], [`The gate would be blocked. Rotate it`, `De poort zou geblokkeerd zijn. Draai het gebouw`], [`Not enough resources`, `Niet genoeg grondstoffen`], [`Already built`, `Al gebouwd`],
  [`Good spot`, `Goede plek`], [`Tap the island to pick a spot`, `Tik op het eiland om een plek te kiezen`], [`Click the island to place it`, `Klik op het eiland om te plaatsen`],
  // what villagers are doing
  [`Stepping aside`, `Stapt opzij`], [`Looking around`, `Kijkt wat rond`], [`Heading to bed`, `Gaat naar bed`], [`Asleep at home`, `Slaapt thuis`], [`Asleep in a tent on the green`, `Slaapt in een tent op het plein`],
  [`Walking to the building site`, `Loopt naar de bouwplaats`], [`Strolling through the village`, `Wandelt door het dorp`], [`Enjoying the view`, `Geniet van het uitzicht`], [`Warming up by the fire`, `Warmt zich bij het vuur`],
  [`Chatting on the green`, `Kletst wat op het plein`], [`Listening to the bumblebees`, `Luistert naar de hommels`], [`Nothing to do for a moment`, `Heeft even niks te doen`], [`No grown trees nearby`, `Geen volgroeide bomen in de buurt`],
  [`Walking to a tree`, `Loopt naar een boom`], [`Felling a tree`, `Hakt een boom om`], [`No rocks nearby: working slower at the hut`, `Geen rotsen in de buurt: werkt trager bij de hut`], [`Walking to the quarry hut`, `Loopt naar de steenhouwerij`],
  [`Cutting stone at the hut`, `Hakt steen bij de hut`], [`Walking to a rock`, `Loopt naar een rots`], [`Cutting stone`, `Hakt steen`], [`Berries are scarce in winter`, `Bessen zijn schaars in de winter`],
  [`Waiting for berries to ripen`, `Wacht tot er weer bessen rijp zijn`], [`Walking to a berry bush`, `Loopt naar een bessenstruik`], [`Picking berries`, `Plukt bessen`], [`Walking to the field`, `Loopt naar de akker`],
  [`Harvesting the grain`, `Oogst het graan`], [`Tidying the field`, `Ruimt de akker op`], [`Tending the crop`, `Verzorgt het gewas`], [`Can't reach the water`, `Kan niet bij het water komen`], [`Walking to the shore`, `Loopt naar de kust`],
  [`Fishing from the shore`, `Vist vanaf de kust`], [`Carrying grain to the bakery`, `Brengt graan naar de bakkerij`], [`Baking bread`, `Bakt brood`], [`Fetching grain from storage`, `Haalt graan uit de opslag`],
  [`Waiting for grain from the farm`, `Wacht op graan van de boerderij`], [`Walking to the apiary`, `Loopt naar de bijenstal`], [`Tending the bees`, `Verzorgt de bijen`], [`Walking to the market`, `Loopt naar de markt`],
  [`Minding the stall`, `Staat achter de kraam`], [`Walking to the tavern`, `Loopt naar de herberg`], [`Polishing mugs`, `Poetst de kroezen`], [`Sweeping the doorstep`, `Veegt de stoep`], [`Telling a tall tale`, `Vertelt een sterk verhaal`],
  [`Walking to the schoolhouse`, `Loopt naar het schooltje`], [`Teaching the alphabet`, `Leert het alfabet aan`], [`Chalking sums on the board`, `Krijt sommen op het bord`], [`Reading a story aloud`, `Leest een verhaal voor`],
  [`Walking to the harbour`, `Loopt naar de haven`], [`Unloading the ship`, `Lost het schip`], [`Watching the horizon`, `Tuurt naar de horizon`], [`Walking to the pasture`, `Loopt naar de wei`], [`Chasing off a fox`, `Jaagt een vos weg`],
  [`Shearing a sheep`, `Scheert een schaap`], [`Carrying wool to the loom`, `Brengt wol naar het weefgetouw`], [`Weaving cloth`, `Weeft stof`], [`Fetching wool from storage`, `Haalt wol uit de opslag`],
  [`Waiting for wool from the pasture`, `Wacht op wol van de schapenwei`], [`Everything has been researched. The scholars can take another job`, `Alles is onderzocht. De geleerden kunnen ander werk gaan doen`],
  [`Walking to the academy`, `Loopt naar de academie`], [`Studying old books`, `Bestudeert oude boeken`], [`Scribbling notes`, `Krabbelt aantekeningen`], [`Arguing about the stars`, `Discussieert over de sterren`], [`Charting the tides`, `Brengt de getijden in kaart`],
  [`Walking to the mine`, `Loopt naar de mijn`], [`Mining stone`, `Delft steen`], [`The trees are bare in winter`, `De bomen zijn kaal in de winter`], [`Walking to the orchard`, `Loopt naar de boomgaard`], [`Picking apples`, `Plukt appels`],
  [`Walking to the greenhouse`, `Loopt naar de kas`], [`Tending seedlings`, `Verzorgt zaailingen`], [`Carrying apples to the press`, `Brengt appels naar de pers`], [`Fetching fruit from storage`, `Haalt fruit uit de opslag`],
  [`Pressing cider`, `Perst cider`], [`Waiting for spare food to press`, `Wacht op voedsel dat over is om te persen`], [`Carrying clay and stone to the kiln`, `Brengt klei en steen naar de oven`], [`Fetching stone from storage`, `Haalt steen uit de opslag`],
  [`Firing bricks`, `Bakt stenen`], [`Waiting for spare stone and wood`, `Wacht op steen en hout dat over is`], [`Walking to the bathhouse`, `Loopt naar het badhuis`], [`Folding towels`, `Vouwt handdoeken`], [`Stoking the boiler`, `Stookt de ketel op`],
  [`Testing the water`, `Voelt aan het water`], [`Walking to the watchtower`, `Loopt naar de wachttoren`], [`Keeping watch`, `Houdt de wacht`], [`Scanning the tree line`, `Speurt de bosrand af`], [`Whistling a tune`, `Fluit een deuntje`],
  [`Waking up`, `Wordt wakker`], [`Can't get there`, `Kan er niet komen`], [`Setting out to explore`, `Trekt eropuit om te verkennen`], [`Full`, `Vol`],
  // happiness
  [`Going hungry`, `Er is honger`], [`Plenty to eat`, `Genoeg te eten`], [`Village charm`, `Sfeer in het dorp`], [`Public gardens`, `Openbare tuinen`], [`Fresh bread`, `Vers brood`], [`Honey in the pantry`, `Honing in huis`],
  [`A cosy tavern`, `Een gezellige herberg`], [`Warm clothes`, `Warme kleren`], [`A kind deed`, `Een goede daad`], [`Festival!`, `Feest!`], [`Cider in the cellar`, `Cider in de kelder`], [`A hot bath`, `Een warm bad`],
  [`Nowhere to gather in the evening`, `Nergens om 's avonds samen te komen`], [`Missing fresh bread`, `Mist vers brood`], [`Shivering without warm clothes`, `Bibbert zonder warme kleren`], [`Worn-out clothes`, `Versleten kleren`], [`Base`, `Basis`],
  [`Happy villagers work faster, and new settlers only come to a pleasant village.`, `Gelukkige dorpelingen werken sneller, en nieuwe bewoners komen alleen naar een fijn dorp.`],
  [`The food has run out! Villagers work slower.`, `Het eten is op! Dorpelingen werken trager.`],
  // goals
  [`Build a Lumber Hut`, `Bouw een Houthakkershut`], [`Open the Materials tab at the bottom.`, `Open onderaan het tabblad Grondstof.`], [`Put 2 woodcutters to work`, `Zet 2 houthakkers aan het werk`], [`Tap the hut and use the plus button.`, `Tik op de hut en gebruik de plusknop.`],
  [`Build a Forager's Hut near the berries`, `Bouw een Plukkershut bij de bessen`], [`Food runs out if nobody gathers any.`, `Voedsel raakt op als niemand iets verzamelt.`], [`Build 2 Cottages`, `Bouw 2 Huisjes`], [`Each cottage adds 3 beds.`, `Elk huisje geeft 3 bedden.`],
  [`Grow the camp into a Hamlet`, `Laat het kamp uitgroeien tot een Gehucht`], [`Build cottages and keep everyone fed. A Hamlet unlocks farming, fishing and bees.`, `Bouw huisjes en zorg dat iedereen te eten heeft. Een Gehucht ontgrendelt landbouw, visserij en bijen.`], [`Build a Quarry Hut`, `Bouw een Steenhouwerij`],
  [`Place it close to grey rocks.`, `Zet hem dicht bij grijze rotsen.`], [`Build a Farm and a Bakery`, `Bouw een Boerderij en een Bakkerij`], [`Grain from the field becomes bread.`, `Graan van de akker wordt brood.`],
  [`Fill a villager's request`, `Vervul een verzoek van een dorpeling`], [`Tap this card to see who is asking for what.`, `Tik op deze kaart om te zien wie wat vraagt.`], [`Place a Well and 3 Lanterns`, `Plaats een Waterput en 3 Lantaarns`],
  [`A charming village makes villagers happy.`, `Een sfeervol dorp maakt dorpelingen gelukkig.`], [`Build an Apiary and collect 5 honey`, `Bouw een Bijenstal en oogst 5 honing`], [`Flower beds nearby double the harvest.`, `Bloemperken in de buurt verdubbelen de oogst.`],
  [`Grow the Hamlet into a Village`, `Laat het Gehucht uitgroeien tot een Dorp`], [`More villagers and a happy mood unlock the market, tavern and more. Tap this card to see what is needed.`, `Meer dorpelingen en een goed humeur ontgrendelen de markt, de herberg en meer. Tik op deze kaart om te zien wat nodig is.`],
  [`Build a Market and earn 60 coins`, `Bouw een Markt en verdien 60 munten`], [`Tap the market to trade. Honey sells well.`, `Tik op de markt om te ruilen. Honing levert veel op.`], [`Open a Tavern and hire an innkeeper`, `Open een Herberg en neem een waard aan`],
  [`A cosy tavern keeps spirits high.`, `Een gezellige herberg houdt de stemming erin.`], [`Build an Academy and finish a research`, `Bouw een Academie en rond een onderzoek af`], [`Scholars gather insight. Tap the Academy to spend it.`, `Geleerden verzamelen inzicht. Tik op de Academie om het te besteden.`],
  [`Send an explorer to an old site`, `Stuur een verkenner naar een oude plek`], [`Look for standing stones, a wreck or a shrine and tap it.`, `Zoek staande stenen, een wrak of een schrijn en tik erop.`], [`Keep sheep and weave 5 cloth`, `Houd schapen en weef 5 stof`],
  [`Build a Sheep Pasture and a Weaver in the Materials tab.`, `Bouw een Schapenwei en een Wever in het tabblad Grondstof.`], [`Hold a festival`, `Vier een feest`], [`Tap this card. A festival costs 30 food and 5 honey.`, `Tik op deze kaart. Een feest kost 30 voedsel en 5 honing.`],
  [`Build a Windmill`, `Bouw een Molen`], [`Every batch of bread will feed more villagers.`, `Elke bakbeurt voedt dan meer dorpelingen.`], [`Upgrade a building`, `Upgrade een gebouw`],
  [`Research Masonry and Carpentry, make bricks, then tap a Cottage or Lumber Hut.`, `Onderzoek Metselwerk en Timmerwerk, bak stenen en tik dan op een Huisje of Houthakkershut.`], [`Grow the Village into a Town`, `Laat het Dorp uitgroeien tot een Stad`],
  [`Keep growing and earn coins by trading. Tap this card to see what is needed.`, `Blijf groeien en verdien munten met handel. Tik op deze kaart om te zien wat nodig is.`], [`Build a Harbour and fill 2 ship orders`, `Bouw een Haven en vervul 2 scheepsorders`], [`The ship calls each morning once a dockhand works there.`, `Het schip komt elke ochtend zodra er een havenwerker werkt.`],
  [`Raise happiness to 85%`, `Breng het geluk naar 85%`], [`Tap the heart to see what helps.`, `Tik op het hartje om te zien wat helpt.`], [`Build the Lighthouse`, `Bouw de Vuurtoren`], [`The pride of the island, right by the water.`, `De trots van het eiland, vlak aan het water.`],
  [`Bumblenook is shining. Keep building at your own pace!`, `Bumblenook straalt. Bouw rustig verder!`], [`All goals reached. The island is yours.`, `Alle doelen gehaald. Het eiland is van jou.`],
  // level needs, village panel
  [`Villagers`, `Dorpelingen`], [`Happiness`, `Geluk`], [`Coins earned`, `Verdiende munten`], [`Current goal`, `Huidig doel`], [`Requests`, `Verzoeken`], [`Festival`, `Feest`], [`Badges`, `Badges`], [`Almanac`, `Almanak`], [`News`, `Nieuws`],
  [`Letters`, `Brieven`], [`Daily island`, `Eiland van de dag`], [`Next:`, `Volgende:`], [`Deliver`, `Lever`], [`Read the letter`, `Lees de brief`], [`Nothing to report yet.`, `Nog niets te melden.`],
  [`Every letter has been answered. Thank you, from all of us.`, `Elke brief is beantwoord. Dank je wel, namens ons allemaal.`], [`Until the ship sails`, `Tot het schip vertrekt`], [`2 days left`, `Nog 2 dagen`], [`Until tomorrow`, `Tot morgen`],
  [`Villagers start asking for things once the camp is a Hamlet.`, `Dorpelingen gaan dingen vragen zodra het kamp een Gehucht is.`], [`Nobody is asking for anything right now. Check back soon.`, `Niemand vraagt nu iets. Kijk straks nog eens.`],
  [`Costs 30 food and 5 honey. Lifts happiness by 15 for most of a day, with fireworks.`, `Kost 30 voedsel en 5 honing. Geeft het grootste deel van de dag 15 extra geluk, met vuurwerk.`],
  [`Festivals start once Bumblenook is a Village.`, `Feesten kunnen zodra Bumblenook een Dorp is.`], [`The festival is in full swing!`, `Het feest is in volle gang!`], [`A festival needs 30 food and 5 honey.`, `Een feest kost 30 voedsel en 5 honing.`],
  [`Everyone gets the same island today.`, `Iedereen krijgt vandaag hetzelfde eiland.`], [`Bumblenook is as grand as a harbour town gets.`, `Bumblenook is zo groots als een havenstad maar kan zijn.`],
  [`Festival! Music, honey cake and fireworks: everyone is in high spirits.`, `Feest! Muziek, honingkoek en vuurwerk: iedereen is in opperbeste stemming.`],
  [`The trading ship has docked. Tap the goal card to see its orders.`, `Het handelsschip heeft aangelegd. Tik op de doelkaart voor de orders.`], [`A shower rolls in. Crops and berries love it.`, `Er trekt een bui over. Gewassen en bessen zijn er dol op.`],
  // badges
  [`First Loaf`, `Eerste brood`], [`Bake your first bread`, `Bak je eerste brood`], [`Good Neighbour`, `Goede buur`], [`Fill 5 requests`, `Vervul 5 verzoeken`], [`Honeypot`, `Honingpot`], [`Collect 40 honey`, `Verzamel 40 honing`],
  [`Green Thumb`, `Groene vingers`], [`Plant 15 saplings`, `Plant 15 boompjes`], [`Lamplighter`, `Lantaarnopsteker`], [`Have 10 lanterns`, `Heb 10 lantaarns`], [`Woolly Jumper`, `Wollen trui`], [`Weave 20 cloth`, `Weef 20 stof`],
  [`Life of the Party`, `Feestbeest`], [`Hold 3 festivals`, `Vier 3 feesten`], [`Merchant Prince`, `Koopmansvorst`], [`Earn 300 coins`, `Verdien 300 munten`], [`Old Salt`, `Zeebonk`], [`Fill 5 ship orders`, `Vervul 5 scheepsorders`],
  [`Full House`, `Volle bak`], [`Reach 30 villagers`, `Bereik 30 dorpelingen`], [`Snug as a Bug`, `Lekker knus`], [`Reach 95% happiness`, `Bereik 95% geluk`], [`Bright Spark`, `Slimmerik`], [`Finish 5 researches`, `Rond 5 onderzoeken af`],
  [`Grand Designs`, `Grootse plannen`], [`Upgrade 3 buildings`, `Upgrade 3 gebouwen`], [`Pathfinder`, `Padvinder`], [`Explore every old site`, `Verken elke oude plek`], [`Master Angler`, `Meestervisser`], [`Catch all 8 kinds of fish`, `Vang alle 8 vissoorten`],
  [`Guiding Light`, `Baken in de nacht`],
  // research and town improvements
  [`Research`, `Onderzoek`], [`Town improvements`, `Stadsverbeteringen`], [`Upgrade`, `Upgrade`], [`Done`, `Klaar`], [`Forestry`, `Bosbouw`], [`Woodcutters bring home 6 wood per tree instead of 4.`, `Houthakkers brengen 6 hout per boom mee in plaats van 4.`],
  [`Wheelbarrows`, `Kruiwagens`], [`Everyone walks 15% faster.`, `Iedereen loopt 15% sneller.`], [`Mining`, `Mijnbouw`], [`Unlocks the Mine: endless stone from the hills.`, `Ontgrendelt de Mijn: eindeloos steen uit de heuvels.`],
  [`Crop Rotation`, `Wisselteelt`], [`Fields grow 30% faster.`, `Akkers groeien 30% sneller.`], [`Orchards`, `Fruitteelt`], [`Unlocks the Orchard and the Cider Press.`, `Ontgrendelt de Boomgaard en de Ciderpers.`],
  [`Cartography`, `Cartografie`], [`Marks every unexplored site on the island.`, `Markeert elke onverkende plek op het eiland.`], [`Masonry`, `Metselwerk`], [`Unlocks the Brickworks. Bricks pay for upgrades and grand buildings.`, `Ontgrendelt de Steenbakkerij. Met bakstenen betaal je upgrades en grote gebouwen.`],
  [`Night Watch`, `Nachtwacht`], [`Unlocks the Watchtower, which keeps foxes and storm damage away.`, `Ontgrendelt de Wachttoren, die vossen en stormschade weghoudt.`], [`Bee Lore`, `Bijenkennis`], [`Apiaries always give double honey.`, `Bijenstallen geven altijd dubbele honing.`],
  [`Carpentry`, `Timmerwerk`], [`Unlocks building upgrades: Townhouse, Sawmill, Stoneworks and more.`, `Ontgrendelt gebouw-upgrades: Herenhuis, Zagerij, Steenhouwerswerf en meer.`], [`Glassmaking`, `Glasblazen`],
  [`Unlocks the Greenhouse: fresh food even in winter.`, `Ontgrendelt de Kas: vers voedsel, zelfs in de winter.`], [`Hot Springs`, `Warme bronnen`], [`Unlocks the Bathhouse.`, `Ontgrendelt het Badhuis.`], [`Navigation`, `Navigatie`],
  [`The trading ship pays 30% more.`, `Het handelsschip betaalt 30% meer.`], [`Civics`, `Bestuur`], [`Unlocks the Town Hall and the Bandstand.`, `Ontgrendelt het Raadhuis en de Muziekkoepel.`],
  [`Cobbled Streets`, `Kasseienstraten`], [`Paths become even faster to walk on.`, `Over paden loop je nog sneller.`], [`Public Gardens`, `Openbare tuinen`], [`Flowers on every corner: lasting extra charm.`, `Bloemen op elke hoek: blijvend extra sfeer.`],
  [`Winter Stores`, `Wintervoorraad`], [`Every kind of good can be stored in far larger amounts.`, `Van alles kan veel meer worden opgeslagen.`], [`Scholarships`, `Studiebeurzen`], [`Room for a third scholar at the Academy.`, `Plek voor een derde geleerde in de Academie.`],
  [`Harbour Crane`, `Havenkraan`], [`Ship orders pay 25% more.`, `Scheepsorders betalen 25% meer.`], [`Festival Fund`, `Feestfonds`], [`Festivals no longer cost food or honey.`, `Feesten kosten geen voedsel of honing meer.`],
  [`Research Carpentry at the Academy first.`, `Onderzoek eerst Timmerwerk in de Academie.`], [`Not enough resources yet.`, `Nog niet genoeg grondstoffen.`],
  // seasons and news
  [`Winter starts tomorrow. Berries and fruit will be scarce: fill the stores with food.`, `Morgen begint de winter. Bessen en fruit worden schaars: vul de voorraad met voedsel.`], [`Spring is here. Everything grows a little faster.`, `De lente is er. Alles groeit een beetje sneller.`],
  [`Summer! Berries ripen quickly now.`, `Zomer! Bessen rijpen nu snel.`], [`Autumn colours the island. Harvests are extra rich.`, `De herfst kleurt het eiland. De oogst is extra rijk.`],
  [`Winter has come. Berries are scarce, fruit trees rest and fields grow slowly: live off your stores.`, `De winter is er. Bessen zijn schaars, fruitbomen rusten en akkers groeien traag: leef van je voorraad.`],
  [`A wandering bard sings on the green. Spirits are high today.`, `Een rondtrekkende bard zingt op het plein. De stemming zit er vandaag goed in.`], [`A perfect night for growing: every field is ready to harvest.`, `Een perfecte groeinacht: elke akker is klaar voor de oogst.`],
  [`A wild swarm moved into the apiary: 5 extra honey.`, `Een wilde zwerm trok in de bijenstal: 5 extra honing.`], [`A storm blew in, but the watch rang the bell in time. The fields were covered.`, `Er stak een storm op, maar de wacht luidde op tijd de bel. De akkers waren afgedekt.`],
  [`A storm flattened a field. A Watchtower would have warned the farmers.`, `Een storm sloeg een akker plat. Een Wachttoren had de boeren gewaarschuwd.`], [`A fox sniffed around the pasture, but the watchman chased it off.`, `Een vos snuffelde rond de wei, maar de wachter joeg hem weg.`],
  [`A fox is bothering the sheep: no wool until this evening. A Watchtower keeps foxes away.`, `Een vos valt de schapen lastig: geen wol tot vanavond. Een Wachttoren houdt vossen weg.`],
  // exploring, fish, story
  [`Old site`, `Oude plek`], [`Send an explorer`, `Stuur een verkenner`], [`Explored. Its story is in the almanac.`, `Verkend. Het verhaal staat in de almanak.`], [`No free villager to send right now.`, `Er is nu geen vrije dorpeling om te sturen.`],
  [`A free villager will walk there and take a careful look.`, `Een vrije dorpeling loopt erheen en kijkt goed rond.`], [`Stone Circle`, `Steencirkel`], [`Mossy stones older than the island's oldest tree.`, `Bemoste stenen, ouder dan de oudste boom van het eiland.`],
  [`Old Shipwreck`, `Oud scheepswrak`], [`Sun-bleached ribs of a ship that never made it home.`, `Door de zon gebleekte spanten van een schip dat nooit thuiskwam.`], [`Lonely Cairn`, `Eenzame steenstapel`],
  [`Someone stacked these stones with great care, long ago.`, `Iemand stapelde deze stenen lang geleden met veel zorg.`], [`Bee Shrine`, `Bijenschrijn`], [`A tiny shrine with a carved bumblebee, half hidden in the grass.`, `Een piepklein schrijn met een uitgesneden hommel, half verscholen in het gras.`],
  [`Silver Bream`, `Zilverbrasem`], [`Harbour Sprat`, `Havensprot`], [`Striped Perch`, `Gestreepte baars`], [`Brook Trout`, `Beekforel`], [`Moon Eel`, `Maanpaling`], [`Winter Cod`, `Winterkabeljauw`], [`Old Pike`, `Oude snoek`], [`Golden Carp`, `Gouden karper`],
  [`Grandma Poppy`, `Oma Poppy`], [`The seed tin`, `Het zaadblikje`], [`Dear settlers, I kept this tin of seeds for sixty years, waiting for someone brave enough to start over on the island. Plant them for me, would you?`, `Lieve nieuwkomers, ik heb dit blikje zaden zestig jaar bewaard, wachtend op iemand die dapper genoeg was om opnieuw te beginnen op het eiland. Planten jullie ze voor mij?`],
  [`Plant 5 saplings (Materials tab)`, `Plant 5 boompjes (tabblad Grondstof)`], [`Captain Reed`, `Kapitein Reed`], [`The old map`, `De oude kaart`],
  [`I sailed past your island as a cabin boy. My captain marked strange places on his chart: standing stones, a wreck, a shrine. Find one, and tell me it was real.`, `Als scheepsjongen voer ik langs jullie eiland. Mijn kapitein tekende vreemde plekken op zijn kaart: staande stenen, een wrak, een schrijn. Vind er een, en vertel me dat het echt was.`],
  [`Tap an old site on the island and send an explorer`, `Tik op een oude plek op het eiland en stuur een verkenner`], [`Wren the bard`, `Wren de bard`], [`A song for Bumblenook`, `Een lied voor Bumblenook`],
  [`I have a new song and nowhere to sing it. Throw me a festival, and I promise the whole island will be humming it for a week.`, `Ik heb een nieuw lied en nergens om het te zingen. Geef een feest, en ik beloof dat het hele eiland het een week lang neuriet.`],
  [`Old Hazel`, `Oude Hazel`], [`The beekeeper's dream`, `De droom van de imker`], [`When I was young I dreamed of an island that smelled of honey from shore to shore. My knees are too old for hives now. Could you make it true?`, `Toen ik jong was, droomde ik van een eiland dat van kust tot kust naar honing rook. Mijn knieën zijn nu te oud voor bijenkasten. Maken jullie het waar?`],
  [`Collect 80 honey in total`, `Verzamel in totaal 80 honing`], [`A light for the sailors`, `Een licht voor de zeelui`],
  [`Ships talk of your harbour in every port now. One thing is missing: a light to guide us home on stormy nights. Build it, and you will never lack for friends at sea.`, `In elke haven praten schepen nu over jullie haven. Eén ding ontbreekt: een licht dat ons op stormachtige nachten thuisbrengt. Bouw het, en jullie hebben altijd vrienden op zee.`],
  [`I will see to it`, `Ik ga ermee aan de slag`],
  // daily goals
  [`Reach 12 villagers`, `Bereik 12 dorpelingen`], [`Earn 60 coins`, `Verdien 60 munten`], [`Grow into a Village`, `Groei uit tot een Dorp`], [`Reach 80% happiness with 10 villagers`, `Bereik 80% geluk met 10 dorpelingen`], [`Collect 15 honey`, `Verzamel 15 honing`],
  [`Build 6 Cottages`, `Bouw 6 Huisjes`], [`Fill 3 requests`, `Vervul 3 verzoeken`], [`Sandbox: everything is unlocked and free. Build whatever you like.`, `Zandbak: alles is ontgrendeld en gratis. Bouw wat je maar wilt.`],
  // panels
  [`Workplace`, `Werkplek`], [`Home`, `Woning`], [`Storage`, `Opslag`], [`Nobody works here yet. Add a villager.`, `Hier werkt nog niemand. Voeg een dorpeling toe.`], [`The bees are thriving: double honey.`, `De bijen doen het goed: dubbele honing.`],
  [`Workers can start once it is built.`, `Werkers kunnen beginnen zodra het gebouwd is.`], [`Fully staffed. Minus sends a villager back to building.`, `Volledig bezet. Met min stuur je een dorpeling terug naar het bouwen.`],
  [`No free villagers. Take someone off another job or build cottages.`, `Geen vrije dorpelingen. Haal iemand bij ander werk weg of bouw huisjes.`], [`Tents for 4 villagers without a cottage.`, `Tenten voor 4 dorpelingen zonder huisje.`],
  [`Demolish`, `Slopen`], [`Sure? Tap again`, `Zeker weten? Tik nog eens`], [`Follow`, `Volg`], [`Set free`, `Maak vrij`], [`Free villagers build whatever you place.`, `Vrije dorpelingen bouwen alles wat je neerzet.`],
  // menus, start, help
  [`Undo`, `Herstel`], [`Rotate`, `Draai`], [`Cancel`, `Stop`], [`Place`, `Plaats`], [`Lower`, `Lager`], [`Higher`, `Hoger`], [`Time of day`, `Tijd van de dag`], [`Skip tutorial`, `Sla uitleg over`], [`Got it`, `Begrepen`],
  [`A cosy island village`, `Een knus eilanddorpje`], [`Build a village of berries, bread and honey. Give your villagers a job and watch the island come to life.`, `Bouw een dorpje vol bessen, brood en honing. Geef je dorpelingen een taak en kijk hoe het eiland tot leven komt.`],
  [`Continue`, `Verder spelen`], [`New village`, `Nieuw dorp`], [`Sandbox`, `Zandbak`],
  [`Drag to move, pinch or scroll to zoom, rotate with two fingers or the right mouse button. Your village is saved in this browser.`, `Sleep om te schuiven, knijp of scrol om te zoomen, draai met twee vingers of de rechtermuisknop. Je dorp wordt in deze browser bewaard.`],
  [`Back to the village`, `Terug naar het dorp`], [`How to play`, `Zo werkt het`], [`Sound`, `Geluid`], [`Music`, `Muziek`], [`Photo mode`, `Fotomodus`], [`Save`, `Opslaan`], [`Full screen`, `Volledig scherm`], [`New island`, `Nieuw eiland`],
  [`Sure? Your current village will be lost`, `Zeker weten? Je huidige dorp verdwijnt`], [`Village saved in this browser.`, `Dorp opgeslagen in deze browser.`], [`Saving isn't possible here.`, `Opslaan lukt hier niet.`],
  [`Full screen isn't available here.`, `Volledig scherm is hier niet beschikbaar.`], [`A fresh island. Have fun!`, `Een nieuw eiland. Veel plezier!`],
  [`Pick a building at the bottom and put it on the island. Free villagers build it for you.`, `Kies onderaan een gebouw en zet het op het eiland. Vrije dorpelingen bouwen het voor je.`],
  [`Tap a workplace and use plus and minus to choose how many villagers work there.`, `Tik op een werkplek en kies met plus en min hoeveel dorpelingen er werken.`],
  [`Villagers eat every day. Keep foragers, fishers or a farm with a bakery going.`, `Dorpelingen eten elke dag. Zorg voor plukkers, vissers of een boerderij met bakkerij.`],
  [`Cottages bring new settlers. Wells, lanterns and flowers keep them happy.`, `Huisjes brengen nieuwe bewoners. Putten, lantaarns en bloemen houden ze gelukkig.`],
  [`Tap the goal card for requests from villagers, badges, festivals and what the next village level unlocks.`, `Tik op de doelkaart voor verzoeken van dorpelingen, badges, feesten en wat het volgende dorpsniveau ontgrendelt.`],
  [`Build an Academy for research: it unlocks new buildings and upgrades. Old sites on the island can be explored.`, `Bouw een Academie voor onderzoek: dat ontgrendelt nieuwe gebouwen en upgrades. Oude plekken op het eiland kun je verkennen.`],
  [`The seasons turn every four days. Stock up before winter, when berries and fruit are scarce.`, `De seizoenen wisselen elke vier dagen. Leg een voorraad aan voor de winter, als bessen en fruit schaars zijn.`],
  [`Everyone sleeps at night. The night passes faster by itself.`, `'s Nachts slaapt iedereen. De nacht gaat vanzelf sneller voorbij.`], [`Controls`, `Besturing`],
  [`Mouse: drag to move, scroll to zoom, right button to rotate. Keys: WASD moves, Q and E rotate, R turns a building, space pauses.`, `Muis: sleep om te schuiven, scrol om te zoomen, rechtermuisknop om te draaien. Toetsen: WASD schuift, Q en E draaien, R draait een gebouw, spatie pauzeert.`],
  [`Touch: drag with one finger, pinch to zoom, twist two fingers to rotate. Tap a spot first, then tap Place.`, `Aanraken: sleep met één vinger, knijp om te zoomen, draai met twee vingers. Tik eerst een plek aan en dan op Plaats.`],
  [`Back`, `Terug`], [`Bumblenook shines!`, `Bumblenook straalt!`], [`Keep building`, `Verder bouwen`],
  [`The lighthouse is lit and the whole island is celebrating. You reached every goal. The village is yours: keep building as long as you like.`, `De vuurtoren brandt en het hele eiland viert feest. Je hebt alle doelen gehaald. Het dorp is van jou: bouw verder zolang je wilt.`],
  [`This browser can't draw the 3D island (WebGL is off).`, `Deze browser kan het 3D-eiland niet tekenen (WebGL staat uit).`], [`nobody yet`, `nog niemand`], [`trees`, `bomen`], [`berry bushes`, `bessenstruiken`], [`rocks`, `rotsen`], [`red berry bushes`, `rode bessenstruiken`],
  // tutorial (with markup)
  [`Good spot: the white outline shows where it will stand. Tap <b>Place</b>.`, `Goede plek: de witte omlijning laat zien waar het komt. Tik op <b>Plaats</b>.`],
  [`Nice, two woodcutters! Close this panel to carry on.`, `Mooi, twee houthakkers! Sluit dit paneel om verder te gaan.`],
  [`This is how villagers get a job: tap <b>+</b> to send a free villager to work here. Minus sends one back.`, `Zo geef je dorpelingen werk: tik op <b>+</b> om een vrije dorpeling hier te laten werken. Met min stuur je er een terug.`],
  [`This button lists every villager and job. You can move people between jobs there too.`, `Deze knop toont alle dorpelingen en banen. Je kunt daar ook mensen van baan laten wisselen.`],
  [`That is all you need. Next, build <b>Cottages</b> in the Village tab so new settlers arrive. Tap the goal card any time for your next goal, requests from villagers, badges and what unlocks when the village grows.`, `Meer heb je niet nodig. Bouw nu <b>Huisjes</b> in het tabblad Dorp, zodat er nieuwe bewoners komen. Tik altijd op de doelkaart voor je volgende doel, verzoeken van dorpelingen, badges en wat er vrijkomt als het dorp groeit.`],
  [`Welcome to Bumblenook! Your villagers need wood first.`, `Welkom in Bumblenook! Je dorpelingen hebben eerst hout nodig.`], [`Villagers eat every day.`, `Dorpelingen eten elke dag.`],
]);
// templates for texts that are put together at run time. {a} {b} {c} are free parts, {n} {m} {k} numbers.
const NL_TPL = [
  [`{a} is finished!`, `{a} is klaar!`], [`Walking to the {a}`, `Loopt naar: {a}`], [`Carrying {a} to storage`, `Brengt {a} naar de opslag`], [`Building: {a}`, `Bouwt aan: {a}`], [`Exploring the {a}`, `Verkent: {a}`],
  [`A cottage of their own ({n}/{m})`, `Een eigen huisje ({n}/{m})`], [`{a} has moved to Bumblenook!`, `{a} komt in Bumblenook wonen!`], [`The Town Hall collected {n} coins in tax.`, `Het Raadhuis inde {n} munten belasting.`],
  [`Market day: the merchant earned {n} coins.`, `Marktdag: de koopman verdiende {n} munten.`], [`Goal reached: {a}. Reward: {b}`, `Doel gehaald: {a}. Beloning: {b}`],
  [`Bumblenook is now a {a}! Unlocked: {b}.`, `Bumblenook is nu een {a}! Ontgrendeld: {b}.`], [`Bumblenook is now a {a}!`, `Bumblenook is nu een {a}!`],
  [`Ship order filled: +{n} coins.`, `Scheepsorder vervuld: +{n} munten.`], [`{a} is delighted: +{n} coins and the whole village cheers up.`, `{a} is dolblij: +{n} munten en het hele dorp fleurt op.`], [`{a} is delighted: +{n} coins.`, `{a} is dolblij: +{n} munten.`],
  [`Badge earned: {a}. +{n} coins and you unlocked the {b}.`, `Badge verdiend: {a}. +{n} munten en je ontgrendelde: {b}.`], [`Badge earned: {a}. +{n} coins.`, `Badge verdiend: {a}. +{n} munten.`],
  [`A new request from {a}. Tap the goal card to read it.`, `Een nieuw verzoek van {a}. Tik op de doelkaart om het te lezen.`],
  [`{a} is planning a picnic and asks for {n} food.`, `{a} plant een picknick en vraagt om {n} voedsel.`], [`{a} wants to fill the pantry before winter: {n} food.`, `{a} wil de voorraadkast vullen voor de winter: {n} voedsel.`],
  [`{a} is building a treehouse and needs {n} wood.`, `{a} bouwt een boomhut en heeft {n} hout nodig.`], [`{a} wants to mend the fences: {n} wood.`, `{a} wil de hekken repareren: {n} hout.`],
  [`{a} dreams of a garden wall: {n} stone.`, `{a} droomt van een tuinmuur: {n} steen.`], [`{a} is paving the yard and asks for {n} stone.`, `{a} bestraat het erf en vraagt om {n} steen.`],
  [`{a} is trying a new porridge and asks for {n} grain.`, `{a} probeert een nieuwe pap en vraagt om {n} graan.`], [`{a} wants to feed the ducks: {n} grain.`, `{a} wil de eenden voeren: {n} graan.`],
  [`{a} has a tickly cough and asks for {n} honey.`, `{a} heeft een kriebelhoest en vraagt om {n} honing.`], [`{a} is baking honey cake: {n} honey.`, `{a} bakt honingkoek: {n} honing.`],
  [`{a} is stuffing a pillow and asks for {n} wool.`, `{a} vult een kussen en vraagt om {n} wol.`], [`{a} needs {n} cloth for new curtains.`, `{a} heeft {n} stof nodig voor nieuwe gordijnen.`], [`{a} is sewing a party dress: {n} cloth.`, `{a} naait een feestjurk: {n} stof.`],
  [`{a} is celebrating a birthday and asks for {n} cider.`, `{a} viert een verjaardag en vraagt om {n} cider.`], [`{a} wants a proper brick oven: {n} bricks.`, `{a} wil een echte stenen oven: {n} bakstenen.`],
  [`The trading ship will buy {n} {a} at a fine price.`, `Het handelsschip koopt {n} {a} voor een mooie prijs.`],
  [`Research complete: {a}. Unlocked: {b}.`, `Onderzoek afgerond: {a}. Ontgrendeld: {b}.`], [`Research complete: {a}.`, `Onderzoek afgerond: {a}.`], [`The council approved: {a}.`, `De raad keurde goed: {a}.`], [`The Town Hall paid for {a}.`, `Het Raadhuis betaalde voor {a}.`],
  [`The stores are full of {a}. Build a Storehouse, trade it at the Market or move a worker to another job.`, `De opslag zit vol {a}. Bouw een Opslagschuur, ruil het op de Markt of geef een werker ander werk.`],
  [`{a} upgraded to {b}!`, `{a} is nu een {b}!`], [`{a} begins.`, `{a} begint.`], [`Day {n}: {a}`, `Dag {n}: {a}`], [`The tide left {n} wood on the beach.`, `Het tij liet {n} hout achter op het strand.`],
  [`A grateful traveller left {n} coins for a warm meal.`, `Een dankbare reiziger liet {n} munten achter voor een warme maaltijd.`], [`{a} is on the way.`, `{a} is onderweg.`],
  [`{a} explored the {b} and found {c}.`, `{a} verkende: {b}. Gevonden: {c}.`], [`{a} explored the {b}.`, `{a} verkende: {b}.`], [`{a} caught a {b}. New in the almanac!`, `{a} ving een {b}. Nieuw in de almanak!`], [`{a} caught the first {b}.`, `{a} ving de eerste {b}.`],
  [`A letter from {a} arrived.`, `Er is een brief van {a} gekomen.`], [`A letter from {a}`, `Een brief van {a}`], [`Letter from {a}`, `Brief van {a}`], [`{a} is overjoyed: "{b}" is complete. Reward: {c}.`, `{a} is dolgelukkig: "{b}" is voltooid. Beloning: {c}.`],
  [`Daily island complete in {n} days! Your best today is {m}.`, `Eiland van de dag gehaald in {n} dagen! Je beste van vandaag is {m}.`], [`Daily island complete in {n} days! A new personal best.`, `Eiland van de dag gehaald in {n} dagen! Een nieuw persoonlijk record.`],
  [`Daily island: {a} as fast as you can.`, `Eiland van de dag: {a}, zo snel als je kunt.`], [`{a}: done in {n} days!`, `{a}: gehaald in {n} dagen!`], [`{a} as fast as you can.`, `{a}, zo snel als je kunt.`], [`Your best today: {n} days.`, `Je beste van vandaag: {n} dagen.`],
  [`Unlocks at {a}`, `Vanaf {a}`], [`Research: {a}`, `Onderzoek: {a}`], [`Badge: {a}`, `Badge: {a}`], [`Unlocks: {a}.`, `Ontgrendelt: {a}.`], [`{a} built`, `{a} gebouwd`],
  [`{a} · goal {n} of {m}`, `{a} · doel {n} van {m}`], [`{a} · all goals reached`, `{a} · alle doelen gehaald`], [`{n} requests · ready to deliver`, `{n} verzoeken · klaar om te leveren`], [`{n} request · ready to deliver`, `{n} verzoek · klaar om te leveren`],
  [`{n} requests`, `{n} verzoeken`], [`{n} request`, `{n} verzoek`], [`Only {n} {a} in reach. Tap Place.`, `Maar {n} {a} binnen bereik. Tik op Plaats.`], [`Only {n} {a} in reach`, `Maar {n} {a} binnen bereik`],
  [`{n} {a} in reach. Tap Place.`, `{n} {a} binnen bereik. Tik op Plaats.`], [`{n} {a} in reach`, `{n} {a} binnen bereik`], [`Good spot. Tap Place.`, `Goede plek. Tik op Plaats.`],
  [`Under construction: {n}%. Waiting for a free villager.`, `In aanbouw: {n}%. Wacht op een vrije dorpeling.`], [`Under construction: {n}%`, `In aanbouw: {n}%`],
  [`{n} free villagers available, {m} with a talent for this job. Plus puts one to work here.`, `{n} vrije dorpelingen beschikbaar, {m} met talent voor dit werk. Met plus zet je er een aan het werk.`],
  [`{n} free villager available, {m} with a talent for this job. Plus puts one to work here.`, `{n} vrije dorpeling beschikbaar, {m} met talent voor dit werk. Met plus zet je die aan het werk.`],
  [`{n} free villagers available. Plus puts one to work here.`, `{n} vrije dorpelingen beschikbaar. Met plus zet je er een aan het werk.`], [`{n} free villager available. Plus puts one to work here.`, `{n} vrije dorpeling beschikbaar. Met plus zet je die aan het werk.`],
  [`Residents ({n}/{m}): {a}`, `Bewoners ({n}/{m}): {a}`], [`Insight: {n}. Every scholar adds 1 insight every few moments.`, `Inzicht: {n}. Elke geleerde levert om de zoveel tijd 1 inzicht op.`],
  [`The village can store {n} each of wood, stone, food and grain, and {m} of finer goods. Every Storehouse adds room.`, `Het dorp kan {n} hout, steen, voedsel en graan opslaan, en {m} van fijnere goederen. Elke Opslagschuur geeft meer ruimte.`],
  [`Needs {n} insight`, `Vraagt {n} inzicht`], [`Needs {n} coins`, `Vraagt {n} munten`], [`Needs {a}`, `Vereist {a}`], [`{a} (hungry)`, `{a} (heeft honger)`],
  [`Lives in a cottage. Has a talent for {a} work and works 30% faster here.`, `Woont in een huisje. Heeft talent als {a} en werkt hier 30% sneller.`], [`Lives in a cottage. Has a talent for {a} work.`, `Woont in een huisje. Heeft talent als {a}.`],
  [`Sleeps in a tent on the green. Has a talent for {a} work and works 30% faster here.`, `Slaapt in een tent op het plein. Heeft talent als {a} en werkt hier 30% sneller.`], [`Sleeps in a tent on the green. Has a talent for {a} work.`, `Slaapt in een tent op het plein. Heeft talent als {a}.`],
  [`Become a {a}`, `Word {a}`], [`{n} villagers, {m} beds`, `{n} dorpelingen, {m} bedden`], [`{n}% content`, `{n}% tevreden`], [`{a} · {b}, day {n}`, `{a} · {b}, dag {n}`], [`{a} · day {n}`, `{a} · dag {n}`],
  [`Fish caught: {n} of {m}`, `Vis gevangen: {n} van {m}`], [`Old sites explored: {n} of {m}`, `Oude plekken verkend: {n} van {m}`], [`{a} ×{n}`, `{a} ×{n}`], [`Undone: {a}. Everything was refunded.`, `Hersteld: {a}. Alles is terugbetaald.`],
  [`Graphics: beautiful`, `Beeld: mooi`], [`Graphics: plain`, `Beeld: gewoon`], [`Graphics: light (faster)`, `Beeld: licht (sneller)`], [`Text size: large`, `Tekst: groot`], [`Text size: normal`, `Tekst: normaal`], [`Language: {a}`, `Taal: {a}`], [`Tip {n} of {m}`, `Tip {n} van {m}`],
  [`{a} Open the <b>{b}</b> tab.`, `{a} Open het tabblad <b>{b}</b>.`], [`{a} Pick the <b>{b}</b>.`, `{a} Kies: <b>{b}</b>.`],
  [`Tap a free spot on the grass near {a}.`, `Tik op een vrije plek op het gras bij {a}.`], [`Click a free spot on the grass near {a}.`, `Klik op een vrije plek op het gras bij {a}.`],
  [`Not there: {a}. Tap the marked spot instead.`, `Daar niet: {a}. Tik liever op de gemarkeerde plek.`], [`Not there: {a}. Click the marked spot instead.`, `Daar niet: {a}. Klik liever op de gemarkeerde plek.`],
  [`Tap the marked spot. It is close to {a}, so the walk is short. A white outline means you can build there.`, `Tik op de gemarkeerde plek. Die ligt dicht bij {a}, dus is het een kort stukje lopen. Een witte omlijning betekent dat je er kunt bouwen.`],
  [`Click the marked spot. It is close to {a}, so the walk is short. A white outline means you can build there.`, `Klik op de gemarkeerde plek. Die ligt dicht bij {a}, dus is het een kort stukje lopen. Een witte omlijning betekent dat je er kunt bouwen.`],
  [`Free villagers walk over and build it. The hammer badge shows the progress. In a hurry? Use <b>3×</b> at the top.`, `Vrije dorpelingen lopen erheen en bouwen het. Het hamerlabel toont de voortgang. Haast? Gebruik <b>3×</b> bovenin.`],
  [`Free villagers walk over and build it. The hammer badge shows the progress.`, `Vrije dorpelingen lopen erheen en bouwen het. Het hamerlabel toont de voortgang.`],
  [`Now put villagers to work. Tap the Lumber Hut (or its badge).`, `Zet nu dorpelingen aan het werk. Tik op de Houthakkershut (of het label erboven).`], [`Now put villagers to work. Click the Lumber Hut (or its badge).`, `Zet nu dorpelingen aan het werk. Klik op de Houthakkershut (of het label erboven).`],
  [`{a} ({n}/{m})`, `{a} ({n}/{m})`], [`{n} {a}`, `{n} {a}`],
];
// --- added with goal tracks, ledger, guilds, winter fun, village life and grand projects ---
for (const [k, v] of [
  [`Grow`, `Groei`], [`Prosper`, `Welvaart`], [`Discover`, `Ontdek`], [`All done`, `Alles gedaan`], [`Goals`, `Doelen`], [`Every goal on this path is done.`, `Elk doel op dit pad is gehaald.`],
  [`In the evening villagers gather there.`, `'s Avonds komen de dorpelingen er samen.`], [`More villagers and a happy mood unlock the market, tavern and more.`, `Meer dorpelingen en een goed humeur ontgrendelen de markt, de herberg en meer.`],
  [`Keep growing and earn coins by trading.`, `Blijf groeien en verdien munten met handel.`], [`Grow the Town into a Harbour Town`, `Laat de Stad uitgroeien tot een Havenstad`], [`Build a Harbour and keep the settlers coming.`, `Bouw een Haven en zorg dat er bewoners blijven komen.`],
  [`Build the Cathedral`, `Bouw de Kathedraal`], [`A grand project for a grand town. It takes a mountain of stone and bricks.`, `Een groots project voor een grootse stad. Het vraagt een berg steen en bakstenen.`],
  [`Raise the Great Hive`, `Richt de Grote Korf op`], [`The crowning wonder of Bumblenook, paid for in honey.`, `Het pronkstuk van Bumblenook, betaald met honing.`],
  [`Stock 60 food`, `Leg 60 voedsel in voorraad`], [`A full pantry keeps settlers coming.`, `Een volle voorraadkast trekt bewoners aan.`], [`Requests start once the camp is a Hamlet. Tap this card to see them.`, `Verzoeken beginnen zodra het kamp een Gehucht is. Tik op deze kaart om ze te zien.`],
  [`Earn 600 coins in total`, `Verdien in totaal 600 munten`], [`Trade surplus at the Market and keep filling requests.`, `Ruil overschotten op de Markt en blijf verzoeken vervullen.`], [`Pay for 3 town improvements`, `Betaal 3 stadsverbeteringen`],
  [`Tap the Town Hall to see what the council can do.`, `Tik op het Raadhuis om te zien wat de raad kan doen.`], [`Fill 25 requests`, `Vervul 25 verzoeken`], [`A village that helps each other.`, `Een dorp dat elkaar helpt.`],
  [`Look for standing stones, a wreck or a shrine on the island and tap it.`, `Zoek staande stenen, een wrak of een schrijn op het eiland en tik erop.`], [`Catch 3 kinds of fish`, `Vang 3 vissoorten`],
  [`A Fishing Hut needs a Hamlet. Every catch is noted in the almanac.`, `Een Vissershut kan vanaf een Gehucht. Elke vangst komt in de almanak.`], [`Cartography marks the ones you have not found.`, `Cartografie markeert de plekken die je nog niet vond.`],
  [`Choose a guild at the Academy`, `Kies een gilde in de Academie`], [`Some research comes in pairs: you can only pick one of the two.`, `Sommig onderzoek komt in paren: je kunt maar een van de twee kiezen.`], [`Finish 8 researches`, `Rond 8 onderzoeken af`],
  [`More scholars means faster insight.`, `Meer geleerden betekent sneller inzicht.`], [`Answer 3 letters`, `Beantwoord 3 brieven`], [`Letters arrive as the village grows. Tap this card to read them.`, `Brieven komen naarmate het dorp groeit. Tik op deze kaart om ze te lezen.`],
  [`Build a Shipyard and finish an expedition`, `Bouw een Scheepswerf en voltooi een expeditie`], [`After the Lighthouse, ships can sail far beyond the horizon.`, `Na de Vuurtoren kunnen schepen ver voorbij de horizon varen.`],
  [`Bring home 4 treasures`, `Breng 4 schatten mee naar huis`], [`Every expedition returns with something from afar.`, `Elke expeditie komt terug met iets van ver.`],
  [`Village ledger`, `Dorpsboekhouding`], [`In stock`, `Voorraad`], [`Yesterday`, `Gisteren`], [`Today`, `Vandaag`], [`no full day yet`, `nog geen hele dag`],
  [`Yesterday shows a whole day. Tap a workplace to change who works where.`, `Gisteren toont een hele dag. Tik op een werkplek om te veranderen wie waar werkt.`], [`In the sandbox nobody goes hungry.`, `In de zandbak heeft niemand honger.`],
  [`Merchants' Guild`, `Koopmansgilde`], [`Market trades and requests pay a quarter more coins.`, `Ruilen op de markt en verzoeken leveren een kwart meer munten op.`], [`Farmers' Guild`, `Boerengilde`],
  [`Farms, orchards and greenhouses yield a quarter more.`, `Boerderijen, boomgaarden en kassen leveren een kwart meer op.`], [`Sea Lore`, `Zeekennis`], [`Fishers bring 2 more food and ship orders pay a quarter more.`, `Vissers brengen 2 extra voedsel en scheepsorders betalen een kwart meer.`],
  [`Wood Lore`, `Boskennis`], [`Trees and berries grow back half as fast again, and foragers pick 1 more.`, `Bomen en bessen groeien anderhalf keer zo snel terug, en plukkers plukken er 1 meer.`], [`Scholars' Circle`, `Geleerdenkring`],
  [`Scholars gather insight a third faster.`, `Geleerden verzamelen een derde sneller inzicht.`], [`Artisans' Hall`, `Ambachtshuis`], [`Weavers, brickmakers and cider makers work a third faster.`, `Wevers, steenbakkers en cidermakers werken een derde sneller.`],
  [`Choose one of these two:`, `Kies een van deze twee:`], [`Not chosen`, `Niet gekozen`],
  [`Looking for good snow`, `Zoekt goede sneeuw`], [`Building a snowman`, `Bouwt een sneeuwpop`], [`Winter Fair!`, `Wintermarkt!`], [`Snowmen on the green`, `Sneeuwpoppen op het plein`], [`Treasures from afar`, `Schatten van ver`],
  [`Hold a Winter Fair`, `Houd een Wintermarkt`], [`In winter this is a Winter Fair: the same cost, 20 extra happiness and coins from visitors.`, `In de winter is dit een Wintermarkt: dezelfde kosten, 20 extra geluk en munten van bezoekers.`],
  [`Heading to the festival`, `Gaat naar het feest`], [`Dancing around the winter fire`, `Danst rond het wintervuur`], [`Dancing at the festival`, `Danst op het feest`], [`Singing along with the band`, `Zingt mee met de muziek`], [`Sharing honey cake`, `Deelt honingkoek uit`],
  [`Clapping to the music`, `Klapt mee op de muziek`], [`Heading to the tavern`, `Gaat naar de herberg`], [`Having a drink at the tavern`, `Drinkt wat in de herberg`], [`Swapping stories at the tavern`, `Wisselt verhalen uit in de herberg`], [`Laughing with friends`, `Lacht met vrienden`],
  [`Looking for a seat`, `Zoekt een zitplaats`], [`Resting on a bench`, `Rust uit op een bankje`], [`Watching the world go by`, `Kijkt naar de voorbijgangers`], [`Enjoying the evening air`, `Geniet van de avondlucht`], [`Strolling to the pond`, `Wandelt naar de vijver`],
  [`Feeding the ducks`, `Voert de eenden`], [`Heading to the green`, `Gaat naar het plein`], [`Watching the sun go down`, `Kijkt naar de zonsondergang`],
  [`Cathedral`, `Kathedraal`], [`A grand project: twin towers over the rooftops. Its bells ring in every new day.`, `Een groots project: twee torens hoog boven de daken. De klokken luiden elke nieuwe dag in.`],
  [`Shipyard`, `Scheepswerf`], [`With a shipwright you can send expeditions beyond the horizon. They return with coins and treasures.`, `Met een scheepsbouwer stuur je expedities voorbij de horizon. Ze komen terug met munten en schatten.`],
  [`Great Hive`, `Grote Korf`], [`The crowning wonder of Bumblenook: a golden hive taller than the trees.`, `Het pronkstuk van Bumblenook: een gouden korf, hoger dan de bomen.`], [`Shipwright`, `Scheepsbouwer`], [`Shipwrights`, `Scheepsbouwers`],
  [`Moon Pearl`, `Maanparel`], [`Spice Chest`, `Specerijenkist`], [`Talking Parrot`, `Pratende papegaai`], [`Golden Bee Idol`, `Gouden bijenbeeldje`], [`Star Chart`, `Sterrenkaart`], [`Singing Shell`, `Zingende schelp`],
  [`Expedition`, `Expeditie`], [`Set sail`, `Zeil uit`], [`The ship is on the move.`, `Het schip is onderweg.`], [`The Shipyard needs a shipwright first.`, `De Scheepswerf heeft eerst een scheepsbouwer nodig.`], [`The Shipyard cannot reach the water.`, `De Scheepswerf kan niet bij het water komen.`],
  [`An expedition needs 80 food, 5 cloth and 100 coins.`, `Een expeditie kost 80 voedsel, 5 stof en 100 munten.`], [`Ready to sail. The ship is away for a little over a day and comes home with coins and a treasure.`, `Klaar om uit te varen. Het schip is ruim een dag weg en komt thuis met munten en een schat.`],
  [`The expedition sets sail. Fair winds!`, `De expeditie vaart uit. Goede vaart!`], [`An expedition left the Shipyard.`, `Er vertrok een expeditie van de Scheepswerf.`], [`Walking to the shipyard`, `Loopt naar de scheepswerf`], [`Caulking the hull`, `Breeuwt de romp`], [`Watching for the sails`, `Kijkt uit naar de zeilen`],
  [`The Great Hive hums`, `De Grote Korf zoemt`], [`Stay a while`, `Blijf nog even`],
  [`From a handful of tents to a harbour town with a cathedral and a hive of gold: Bumblenook is complete. Thank you for building it. The island stays yours for as long as you like.`, `Van een handvol tenten tot een havenstad met een kathedraal en een gouden korf: Bumblenook is af. Dank je wel voor het bouwen. Het eiland blijft van jou, zolang je maar wilt.`],
  [`Winter Wonder`, `Winterwonder`], [`Hold a Winter Fair and build 3 snowmen`, `Houd een Wintermarkt en bouw 3 sneeuwpoppen`], [`World Traveller`, `Wereldreiziger`], [`Bring home all 6 treasures`, `Breng alle 6 schatten mee naar huis`],
  [`Queen of the Hive`, `Koningin van de korf`],
  [`Three goals run side by side: Grow, Prosper and Discover. Tap the goal card for details, requests, badges and festivals.`, `Er lopen drie doelen naast elkaar: Groei, Welvaart en Ontdek. Tik op de doelkaart voor details, verzoeken, badges en feesten.`],
  [`Tap any resource at the top for the village ledger: what came in and what was used, per day.`, `Tik bovenin op een grondstof voor de dorpsboekhouding: wat er per dag binnenkwam en wat er verbruikt is.`],
]) NL.set(k, v);
NL_TPL.unshift(
  [`{a} · {n} of {m} goals`, `{a} · {n} van {m} doelen`], [`The village eats about {n} food a day. The pantry lasts roughly {m} days without new food.`, `Het dorp eet ongeveer {n} voedsel per dag. De voorraad gaat zonder aanvoer zo'n {m} dagen mee.`],
  [`{a}, day {n}`, `{a}, dag {n}`], [`You chose the {a}`, `Je koos: {a}`], [`The Winter Fair is open! Lanterns, hot cider and a great fire on the green. Visitors left {n} coins.`, `De Wintermarkt is open! Lantaarns, warme cider en een groot vuur op het plein. Bezoekers lieten {n} munten achter.`],
  [`The ship is far out at sea. It returns in about {n} hours.`, `Het schip is ver op zee. Het komt over ongeveer {n} uur terug.`], [`The expedition is home with {n} coins and a treasure: the {a}!`, `De expeditie is thuis met {n} munten en een schat: {a}!`],
  [`The expedition is home with {n} coins and tales of faraway shores.`, `De expeditie is thuis met {n} munten en verhalen over verre kusten.`], [`Build the {a} first`, `Bouw eerst: {a}`], [`Treasures brought home: {n} of {m}`, `Schatten thuisgebracht: {n} van {m}`]);
const _nlLower = new Map(); for (const [k, v] of NL) _nlLower.set(k.toLowerCase(), v);
const _nlRx = NL_TPL.map(([en, nl]) => {
  const names = [];
  const src = en.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{([a-z])\}/g, (m, p) => { names.push(p); return 'nmk'.includes(p) ? '(-?\\d+(?:\\.\\d+)?)' : '(.+?)'; });
  return { rx: new RegExp('^' + src + '$'), nl, names };
});
const _trCache = new Map();
function trPart(s) {              // a captured piece: a name, a resource, a list such as "15 food, 10 wood"
  if (NL.has(s)) return NL.get(s);
  const low = _nlLower.get(s.toLowerCase());
  if (low) return s[0] === s[0].toLowerCase() ? low.toLowerCase() : low;
  if (s.includes(', ')) return s.split(', ').map(trPart).join(', ');
  if (s.includes(' and ')) return s.split(' and ').map(trPart).join(' en ');
  return trText(s);
}
function trText(s) {
  if (SET.lang !== 'nl' || !s) return s;
  const hit = _trCache.get(s);
  if (hit !== undefined) return hit;
  let out = s;
  const core = s.trim();
  if (/[A-Za-z]{2}/.test(core)) {
    let t = NL.get(core);
    if (t === undefined) {
      for (const r of _nlRx) {
        const m = r.rx.exec(core);
        if (!m) continue;
        t = r.nl.replace(/\{([a-z])\}/g, (q, p) => { const v = m[r.names.indexOf(p) + 1]; return 'nmk'.includes(p) ? v : trPart(v); });
        break;
      }
    }
    if (t === undefined && core.endsWith('.') && NL.has(core.slice(0, -1))) t = NL.get(core.slice(0, -1)) + '.';
    if (t !== undefined) out = s.replace(core, () => t);
  }
  if (_trCache.size > 3000) _trCache.clear();
  _trCache.set(s, out);
  return out;
}
// walk the interface and swap text in place; each text node remembers its English source
let _i18nDirty = false;
function translateDom() {
  if (SET.lang !== 'nl' && !_i18nDirty) return;
  _i18nDirty = SET.lang === 'nl';
  for (const id of ['hud', 'start', 'modal', 'coach', 'photo']) {
    const root = $(id); if (!root) continue;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentNode;
      if (!p || p.id === 'coach-text' || (p.closest && p.closest('svg,#coach-text'))) continue;
      const cur = n.nodeValue;
      if (n._out !== cur) n._en = cur;
      const out = trText(n._en);
      if (out !== cur) n.nodeValue = out;
      n._out = out;
    }
  }
}
