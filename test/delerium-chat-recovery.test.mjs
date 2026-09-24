import test from 'node:test';
import assert from 'node:assert/strict';

test('completed search recovery posts one GM summary without rerolling, preserves outcomes, and rejects player finalization', async t => {
 const names=['game','foundry','MorelordCore','Hooks','ChatMessage','ui'];
 const saved=names.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]);
 t.after(()=>{for(const [key,value] of saved)if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];});
 globalThis.foundry={applications:{api:{ApplicationV2:class{},HandlebarsApplicationMixin:Base=>Base}},utils:{deepClone:structuredClone,escapeHTML:String}};
 const gm={id:'gm',isGM:true,active:true},player={id:'player',active:true};
 const users=[gm,player];users.get=id=>users.find(user=>user.id===id);
 const session={id:'search',status:'complete',zone:{name:'Outer City'},successes:2,failures:3,selectedCharacterUuids:['Actor.a'],participants:{a:{actorUuid:'Actor.a',total:20,status:'succeeded'}},rewards:[],randomEncounter:true};
 const messages=[];messages.get=id=>messages.find(message=>message.id===id);
 function document(data){return {...data,author:gm,getFlag(id,key){return this.flags?.[id]?.[key];},async update(patch){for(const [key,value] of Object.entries(patch)){if(key==='flags.morelord-craftworks.chatSearch')this.flags['morelord-craftworks'].chatSearch=value;else this[key]=value;}return this;}};}
 const record=document({id:'record',whisper:[],flags:{'morelord-craftworks':{chatSearch:structuredClone(session)}}});messages.push(record);
 globalThis.game={user:gm,users,messages,actors:new Map(),settings:{settings:new Map()}};
 const handlers=new Map(),errors=[];
 globalThis.ui={notifications:{error:message=>errors.push(message)}};
 globalThis.Hooks={on(){}};
 const channel={on:(type,handler)=>handlers.set(type,handler),executeAsUser:(type,data)=>handlers.get(type)(data,{senderUserId:gm.id})};
 globalThis.MorelordCore={chatRequests:{register(){}},socket:{createChannel:()=>channel}};
 const options=[];
 globalThis.ChatMessage={async create(data,config){options.push(config);const message=document({...data,id:'result'});messages.push(message);return message;}};
 const api={sessions:{import:structuredClone},deleriumSearch:{async finalize(){throw Error('Completed search must not finalize again');},async rollAndAward(){throw Error('Must not award during recovery');}}};
 const {initializeDeleriumChatRequests}=await import('../scripts/acquisition/delerium-chat-requests.mjs');
 initializeDeleriumChatRequests(api);
 for(let i=0;i<10 && messages.length<2;i++)await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(errors,[]);assert.equal(messages.length,2);
 assert.deepEqual(record.whisper,['gm']);assert.deepEqual(messages[1].whisper,['gm']);
 assert.equal(options[0].messageMode,'gm');
 assert.match(messages[1].content,/No delerium found/);assert.match(messages[1].content,/Random encounter required/);
 assert.deepEqual(record.getFlag('morelord-craftworks','chatSearch'),session);
 initializeDeleriumChatRequests(api);
 await channel.executeAsUser('finalize',{messageId:record.id});
 assert.equal(messages.length,2);
 await assert.rejects(()=>handlers.get('finalize')({messageId:record.id},{senderUserId:player.id}),/Only the active GM/);
});
