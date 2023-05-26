const ids = {
  // User IDs
  clientID: "1109726620434038794",
  ownerID: "1087176549939286095",

  // Server IDs
  mainServerID: "1109688873187020893",
  staffServerID: "1109690822854717582",

  // Staff Server Channel IDS
  statusChannel: "1109690823840387142",
  staffLBChannel: "1109690823303516232",
  highStaffChannel: "1109690823840387143",
  applicationLogChannel: "1109690823647440987",
  staffWelcomeChannel: "1109690822900854823",
  modGuideChannel: "1109690823303516238",
  tutorGuideChannel: "1109690823303516239",

  // Channel IDs
  mainGeneralChat: "1110992982326386790",
  getHelpChannel: "1109688875061870698",
  mainLBChannel: "1109688874634067972",
  punishmentChannel: "1109688875682631753",
  welcomeChannel: "1109688874634067969",
  rulesChannel: "1109688874634067969",
  countingChannel: "1109688874822799431",
  suggestionChannel: "1109688874822799425",

  // Category IDs
  academicCategory: "1109688875061870697",

  // Message IDs
  openMessage: "1109882963971289160",
  closeMessage: "1109882965577703425",
};

const roles = {
  // Ping Roles
  deadChatRole: "1109688873530953751",
  eventPingRole: "1109688873530953750",
  giveawayPingRole: "1109688873530953749",
  journalPingRole: "1109688873530953755",
  questionPingRole: "1109688873530953756",
  announcementPings: "1109688873530953758",
  factPingRole: "1109688873530953756",
  applicationPingRole: "1109690822900854814",
  welcomePingRole: "1109688873497411592",
  suggestionPingRole: "1109688873497411593",
  ticketPingRole: "1109978528507764776",
  bumpPings: "1109688873530953757",

  // Misc Roles
  noCooldownRole: "1109688873778430131",
  noAutoReplyRole: "1109688873635811412",
  boosterRole: "1109705746515509318",
  muteRole: "1109688873753247772",
  memberRole: "1109688873635811413",
  botRole: "1109688873635811411",

  // Level Roles
  levelonerole: "1109688873635811414",
  leveltworole: "1109688873635811414",
  levelthreerole: "1109688873635811416",
  leveltwentyrole: "1109688873635811417",
  levelthirtyrole: "1109688873669361674",
  levelfortyrole: "1109688873669361675",
  levelfiftyrole: "1109688873669361676",

  // Staff Roles (staff server)
  staffJrMod: "1109690822884069543",
  staffTrialTutor: "1109690822884069537",
  staffModTeam: "1109690822884069542",
  staffTutorTeam: "1109690822884069536",

  // Staff Roles (main server)
  mainJrMod: "1109688873837137924",
  mainModTeam: "1109688873837137923",
  mainStaffrole: "1109688873778430128",
  mainTrialTutor: "1109688873837137921",
};

// XP parameters
const xp = {
  minXP: 8,
  maxXp: 12,
};

module.exports = {
  ...ids,
  ...roles,
  ...xp,
};
