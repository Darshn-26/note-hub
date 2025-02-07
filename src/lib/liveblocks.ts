import {Liveblocks} from '@liveblocks/node';

const key=process.env.LIVEBLOCKS_SECRET_KEY;
if(!key){
    throw new Error('Missing Liveblocks secret key');
}
const liveblocks = new Liveblocks({
    secret: key,
  });
  
export default liveblocks