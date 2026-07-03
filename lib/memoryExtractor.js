export function extractMemory(text) {

const patterns = [

/my name is (.+)/i,

/i like (.+)/i,

/my favorite color is (.+)/i,

/my favorite food is (.+)/i,

/i live in (.+)/i,

/i work as (.+)/i,

];

for(const pattern of patterns){

const match = text.match(pattern);

if(match){

return text;

}

}

return null;

}