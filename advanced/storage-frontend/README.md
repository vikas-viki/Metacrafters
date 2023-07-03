- Setup NextJS App
    
    Create a nextjs app with below command
    
    ```bash
    npx create-next-app storage-frontend
    ```
    
    Add tailwind (to make it simpler to add styling for frontend elements)
    
    [https://tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs) (Step 2 and 3 from the link)


- Metamask and Network Setup
    
    Make sure you installed metamask or other wallet provider.
    
    Switch the network to Sepolia
    
    Make sure to have some Sepolia ETH to test the app.

- Install required dependencies

    To start from scratch

    `npm install ethers axios web3modal @walletconnect/web3-provider`

    Update the code in `index.js` as per the requirement.

    
    To simulate the exisiting one:

    Clone the repo.

    Run `npm i` and `npm run dev`


- To connect your own contract

    Update the `/next.config.js` env variables `CONTRACT_ADDRESS` and `ABI`
