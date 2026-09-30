/* Bundled original family encouragement; no remote quote service or attribution claims. */
var FAMILY_DEFAULTS = {
  version: 1,
  names: {person1:'Child 1',person2:'Child 2'},
  tasks: {
    person1: [{id:'a1',text:'Make my bed'},{id:'a2',text:'Read for 20 minutes'},{id:'a3',text:'Finish homework'},{id:'a4',text:'Pack my school bag'}],
    person2: [{id:'s1',text:'Make my bed'},{id:'s2',text:'Read for 20 minutes'},{id:'s3',text:'Finish homework'},{id:'s4',text:'Pack my school bag'}]
  },
  completion: {},
  /* Future provider adapter returns events: {id, date:'YYYY-MM-DD', title, source:'local'|'google'}.
     Calendar rendering is independent of the provider. No credentials belong here. */
  calendar: {provider:'local',events:[]},
  meals:'', grocery:''
};
var FAMILY_QUOTES = [
 'Small steps make wonderful journeys.', 'A little kindness can brighten someone’s whole day.',
 'You don’t have to be perfect to make progress.', 'Try again. Every new try teaches you something.',
 'Make room for curiosity today.', 'Helping each other makes our family stronger.',
 'Be proud of the effort you put in.', 'Listen with care. Speak with kindness.',
 'Big things begin with one small step.', 'Today is a fresh chance to learn something.',
 'There is courage in asking for help.', 'Take your time and do one thing well.',
 'Share a smile. It may travel farther than you think.', 'Practice turns “not yet” into “I can.”',
 'Leave a little goodness wherever you go.', 'You can be brave and feel nervous at the same time.',
 'Celebrate the small things you finish.', 'A thoughtful word is a gift anyone can give.',
 'Rest, breathe, and begin again.', 'Choose one good thing to do today.',
 'Your questions can open new doors.', 'We all have something to teach and something to learn.',
 'Look for something beautiful in an ordinary moment.', 'Being helpful is a quiet kind of strength.',
 'Give today your attention, one moment at a time.', 'Mistakes are part of learning.',
 'Make time for the people you love.', 'A good day can begin with a kind choice.',
 'There is more than one way to solve a problem.', 'Let your effort be something you are proud of.',
 'Together, we can make home a happier place.'
];
