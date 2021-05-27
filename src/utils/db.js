import {getFirestore,setDoc, doc} from 'firebase/firestore'


export const addUser = async (authUser) => {
  console.log('meow')
  const reference = doc(getFirestore(), 'users', authUser.uid)
  const resp = await setDoc(reference, {...authUser})
  return resp;
};
