
"use client";
import { useUser,SignedIn,SignInButton,SignedOut, UserButton } from '@clerk/nextjs';
import Breadcrumbs from './Breadcrumbs';

function Header() {
    const {user }=useUser();

  return (
    <div className='flex items-center justify-between p-5'>
        {user &&(
            <div>
                <h1 className='text-2xl font-normal '>
                    Hi ! {user?.firstName} 
                    {`s`} space
                </h1>
            </div>
        )}
        {/*Breadcrubs */}
        <Breadcrumbs/>
        <div>
            <SignedOut>
                <SignInButton/>
            </SignedOut>

            <SignedIn>
                <UserButton/>
            </SignedIn>

        </div>

    </div>
  )
}

export default Header