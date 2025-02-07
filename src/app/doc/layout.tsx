import LiveBlocksProvider from '@/components/LiveBlocksProvider'


function PageLoyout( {children}: {children: React.ReactNode}) {


  return (
    <LiveBlocksProvider>
        {children}
    </LiveBlocksProvider>
  )
}

export default PageLoyout