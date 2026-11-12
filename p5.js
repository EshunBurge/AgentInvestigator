Object.assign(TOPICS, {
appdev:{name:'AI for App Development', blurb:'AI can write code fast. You are the engineer who reads, tests and owns it.',
  terms:[['Bug','A mistake that makes software misbehave'],['API','A way for programs to talk to each other'],['Test','A check that code does what you expect'],['Version control','A history of every change to the code']],
  labs:[['You want a button that saves a note in your web app.',['Make an app','Write JavaScript for a Save button that stores the text of a textarea in localStorage. Add comments and handle empty text.','Code'],1,'It names the language, the behavior and edge cases.'],
        ['Your function throws an error.',['It does not work','Here is the function and the exact error message: TypeError undefined. Explain the cause and give a fix with a test.','Fix it'],1,'Share the code, the error and ask for a test.']],
  steps:[
  ['Start with the idea','Describe what the app should do and who it is for before any code.','What comes first when building an app?','The idea and the user',['The logo','The code editor theme','The app store'],'Clear goals keep code focused.'],
  ['Break it into features','Split the app into small features and build one at a time.','Why build feature by feature?','Small steps are easier to test',['It is slower','It hides bugs','It is required'],'Short loops catch problems early.'],
  ['Ask for code','Name the language, what it should do and any limits. Ask AI to explain it.','What makes a code request clear?','Language, behavior and limits',['"Make it work"','"Code"','"Fast"'],'Details give useful code.'],
  ['Read before you run','Read every line you did not write. If you do not understand it, ask the AI to explain.','What should you do with AI code you do not understand?','Ask for an explanation before using it',['Run it','Delete the tests','Share it'],'You own the code you ship.'],
  ['Test it','Write tests for normal inputs and strange ones like empty or huge values.','Why test edge cases?','Bugs hide there',['They are boring','They never matter','They slow the app'],'Edge cases break weak code.'],
  ['Debug with context','Give the AI the code, the error message and what you expected.','What helps AI debug best?','The code, the error and your expectation',['"It is broken"','A screenshot only','Nothing'],'Details point to the cause.'],
  ['Security basics','Never paste secret keys into AI tools or public code. Validate user input.','Which should never be pasted into a prompt?','A secret API key',['A function name','A comment','A loop'],'Leaked keys can be abused.'],
  ['Use version control','Save changes with Git so you can undo mistakes and see what AI changed.','What does version control give you?','A history and an undo button',['Faster typing','Free music','More bugs'],'You can always return to a working version.'],
  ['Respect licenses','Some code has rules for reuse. Follow licenses and credit authors.','Why check code licenses?','Reuse can have legal rules',['They do not exist','They are for fun','They are optional'],'Licenses protect creators.'],
  ['Ship responsibly','Before release, check privacy, accessibility and who might be harmed by bugs.','What should you check before releasing?','Privacy, accessibility and safety',['Only looks','Only speed','Only the name'],'Real users deserve safe software.']
  ]},
workforce:{name:'AI in the Workforce', blurb:'Employers want people who can direct AI, check it and take responsibility for the result.',
  terms:[['Workflow','The steps a team follows to do a job'],['Automation','Letting software do repeat tasks'],['Upskill','Learn new skills for the job'],['Confidentiality','Keeping company info private']],
  labs:[['Your manager asks you to summarize a long client report.',['Paste the whole confidential report into any free AI tool','Check the company AI policy, use the approved tool, remove client names and review the summary before sharing.','Skip the report'],1,'Follow policy and protect client info.'],
        ['You want to show your skills in an interview.',['Say AI does all my work','Explain a project where you used AI to draft, then verified results, fixed errors and measured the outcome.','Say you never use AI'],1,'Show judgment, not just tool use.']],
  steps:[
  ['AI is on the job','Many jobs now use AI for drafting, research, scheduling and customer help.','Which job might use AI?','Almost any',['Only coders','Only artists','Only scientists'],'AI is spreading across fields.'],
  ['Tasks, not jobs','AI changes tasks inside jobs. People who learn to direct it become more valuable.','What does AI mostly change?','Tasks inside jobs',['Nothing','Whole jobs overnight','Only salaries'],'Roles shift as tasks shift.'],
  ['Follow company policy','Companies set rules for AI tools. Ask before you use one with company data.','What should you do before using an AI tool at work?','Check the company policy',['Assume it is fine','Hide it','Ask a friend'],'Policy protects the company and you.'],
  ['Confidentiality','Never paste client data, trade secrets or private information into unapproved tools.','What should you keep out of public AI tools?','Confidential company info',['Public facts','Your own name','A greeting'],'Leaks can cost jobs and trust.'],
  ['Verify before you send','AI work still needs checking before it goes to a customer or boss.','Who is responsible for AI-drafted work you send?','You are',['The tool','The vendor','Nobody'],'Employers hold you accountable.'],
  ['Teamwork and AI','Tell teammates when AI helped so they can review it properly.','Why tell your team about AI use?','They can check it and trust it',['It is a secret','It is a rule of nature','It slows work'],'Openness avoids surprises.'],
  ['Build your skills','Learn how to prompt, check and improve AI output. Keep learning as tools change.','What skill stays valuable?','Judgment and checking',['Typing speed only','Memorizing prompts','Ignoring AI'],'Tools change; judgment lasts.'],
  ['Show it in applications','Describe real projects: the problem, how you used AI and what you checked.','What impresses employers most?','Results and good judgment',['Tool names only','Long lists','Secrecy'],'Evidence beats buzzwords.'],
  ['Ethics at work','Treat customers fairly, protect privacy and speak up about harm.','What should you do if an AI process treats customers unfairly?','Report it',['Ignore it','Copy it','Hide it'],'Ethical workers raise concerns.'],
  ['Plan your path','Explore careers, find mentors and build projects that show what you can do with AI.','What helps you prepare for a career?','Projects, mentors and learning',['Waiting','Avoiding AI','Copying others'],'Action builds readiness.']
  ]}
});

const SHOP = [
  {id:'out-ops', kind:'outfit', name:'Black Ops Suit', price:60, note:'Matte black, red stripe'},
  {id:'out-hood', kind:'outfit', name:'Night Hoodie', price:70, note:'Quiet and dark'},
  {id:'out-vest', kind:'outfit', name:'Tactical Vest', price:80, note:'Pockets for every gadget'},
  {id:'out-trench', kind:'outfit', name:'Crimson Trench', price:90, note:'Long coat in deep red'},
  {id:'out-ghost', kind:'outfit', name:'Ghost Camo', price:110, note:'Blends into any wall'},
  {id:'out-tux', kind:'outfit', name:'Gala Tuxedo', price:120, note:'For undercover galas'},
  {id:'out-gold', kind:'outfit', name:'Golden Agent', price:220, note:'For legends only'},
  {id:'acc-ear', kind:'acc', name:'Comms Earpiece', price:30, note:'Stay in contact'},
  {id:'acc-visor', kind:'acc', name:'Night Visor', price:40, note:'Red-lit visor'},
  {id:'acc-mask', kind:'acc', name:'Domino Mask', price:45, note:'Classic disguise'},
  {id:'acc-shades', kind:'acc', name:'Agent Shades', price:50, note:'Dark lenses'},
  {id:'acc-mono', kind:'acc', name:'Monocle', price:60, note:'Spot the forgery'},
  {id:'acc-hat', kind:'acc', name:'Detective Hat', price:70, note:'Low brim, sharp eyes'},
  {id:'boost-freeze', kind:'boost', name:'Streak Freeze', price:50, note:'Saves your streak if you miss one day'},
  {id:'boost-hint', kind:'boost', name:'Hint Pack (3)', price:30, note:'Removes one wrong answer, three times'},
  {id:'boost-heart', kind:'boost', name:'Armor Plate', price:40, note:'Start your next arena fight with 4 hearts'}
];
const SKINS = ['#f6d3b1','#e0ac7e','#bb7f55','#8d5524','#5a3825'];
const HAIRC = ['#1a1a1a','#6b4226','#d4a017','#b00000','#e5e5e5'];
const HAIRS = [['short','Short'],['long','Long'],['buzz','Buzz'],['curly','Curly'],['bun','Bun']];
const BADGES = [
  {id:'first', name:'First Contact', hint:'Finish your first lesson', icon:'star'},
  {id:'streak3', name:'Three-Day Tail', hint:'3-day streak', icon:'flame'},
  {id:'streak7', name:'Week on Watch', hint:'7-day streak', icon:'flame'},
  {id:'streak14', name:'Fortnight Agent', hint:'14-day streak', icon:'flame'},
  {id:'streak30', name:'Month in the Field', hint:'30-day streak', icon:'flame'},
  {id:'sharp', name:'Sharp Eye', hint:'25 correct answers', icon:'quiz'},
  {id:'perfect', name:'Clean Sweep', hint:'A lesson with no mistakes', icon:'check'},
  {id:'level', name:'Level Cleared', hint:'Clear a chapter', icon:'shield'},
  {id:'test', name:'Test Passed', hint:'Pass a chapter test', icon:'trophy'},
  {id:'quest', name:'Quest Runner', hint:'Claim a daily quest', icon:'scroll'},
  {id:'shopper', name:'Fresh Disguise', hint:'Buy a shop item', icon:'shop'},
  {id:'track', name:'Track Complete', hint:'Finish a track', icon:'trophy'}
];
const RIVALS = [
  ['Nightjar','#8d5524',410],['Cipher','#f6d3b1',360],['Vesper','#e0ac7e',320],['Ghost','#5a3825',270],['Falcon','#bb7f55',230],['Rook','#f6d3b1',190],['Moth','#e0ac7e',140],['Echo','#bb7f55',90]
];
