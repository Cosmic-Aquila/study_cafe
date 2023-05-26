async function reactionRoles(messageID, emoji, member) {
  const guild = member.guild;
  switch (messageID) {
    case "1110408033948934246":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873635811410");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873635811409");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873635811408");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873589686341");
        member.roles.add(role);
      } else if (emoji === "five") {
        const role = await guild.roles.fetch("1109688873589686340");
        member.roles.add(role);
      }
      break;
    case "1110408997984542760":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873589686339");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873589686338");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873589686337");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873589686336");
        member.roles.add(role);
      }
      break;
    // file deepcode ignore DuplicateCaseBody: <please specify a reason of ignoring this>
    case "1110409412478238720":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873589686332");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873551921191");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873551921189");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873551921188");
        member.roles.add(role);
      }
      break;
    case "1110410509213241384":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873551921187");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873551921186");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873551921185");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873551921184");
        member.roles.add(role);
      } else if (emoji === "five") {
        const role = await guild.roles.fetch("1109688873551921183");
        member.roles.add(role);
      } else if (emoji === "six") {
        const role = await guild.roles.fetch("1109688873551921182");
        member.roles.add(role);
      }
      break;
    case "1110411293015429181":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873530953756");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873530953755");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873530953758");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873530953757");
        member.roles.add(role);
      } else if (emoji === "five") {
        const role = await guild.roles.fetch("1109688873530953751");
        member.roles.add(role);
      } else if (emoji === "six") {
        const role = await guild.roles.fetch("1109688873530953749");
        member.roles.add(role);
      } else if (emoji === "seven") {
        const role = await guild.roles.fetch("1109688873497411593");
        member.roles.add(role);
      } else if (emoji === "eight") {
        const role = await guild.roles.fetch("1109688873497411592");
        member.roles.add(role);
      }
      break;
    case "1111028949431111772":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873753247770");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873732280321");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873753247764");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873732280322");
        member.roles.add(role);
      } else if (emoji === "five") {
        const role = await guild.roles.fetch("1109688873732280320");
        member.roles.add(role);
      } else if (emoji === "six") {
        const role = await guild.roles.fetch("1109688873732280325");
        member.roles.add(role);
      } else if (emoji === "seven") {
        const role = await guild.roles.fetch("1109688873690349688");
        member.roles.add(role);
      } else if (emoji === "eight") {
        const role = await guild.roles.fetch("1109688873690349687");
        member.roles.add(role);
      }
      break;
    case "1111583792373715004":
      if (emoji === "one") {
        const role = await guild.roles.fetch("1109688873690349683");
        member.roles.add(role);
      } else if (emoji === "two") {
        const role = await guild.roles.fetch("1109688873690349682");
        member.roles.add(role);
      } else if (emoji === "three") {
        const role = await guild.roles.fetch("1109688873690349681");
        member.roles.add(role);
      } else if (emoji === "four") {
        const role = await guild.roles.fetch("1109688873690349680");
        member.roles.add(role);
      } else if (emoji === "five") {
        const role = await guild.roles.fetch("1109688873669361678");
        member.roles.add(role);
      } else if (emoji === "six") {
        const role = await guild.roles.fetch("1109688873669361682");
        member.roles.add(role);
      }
      break;
  }
}
module.exports = { reactionRoles };
