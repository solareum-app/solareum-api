Ref: https://spl.solana.com/token

XSB contract: 4UuGQgkD3rSeoXatXRWwRfRd21G87d5LiCfkVzNNv1Tt

Hot wallet:
- SOL address: 7Kwq7Hj6q2u2tx35zZvFHsKLseKm3Y753aQTVEcy8rtv
- XSB account: DpG4yXVJw1CPwg6dYidiMs83tuckA98Bh3r9qdmheBQx

Cold wallet:
- SOL address: BZjZtMCTqvg3MRxaNPmXDL4ErywtHVwSwb5njLpGsyQe
- XSB account: EREAtm5y1NioFgnV2HH7CEe3ge5U8d3qaj7weFqEkWCQ

ORG wallet:
- SOL address: 296fJkoJNNM9t4pLthevB84pE4rjAJTbceM24ZHjKhRF

### spl-token cli

```shell
spl-token accounts
```

```shell
Transfer token to hot wallet
spl-token transfer --fund-recipient EREAtm5y1NioFgnV2HH7CEe3ge5U8d3qaj7weFqEkWCQ 1 7Kwq7Hj6q2u2tx35zZvFHsKLseKm3Y753aQTVEcy8rtv
```


Create a new wallet for the company
https://docs.solana.com/wallet-guide/file-system-wallet
```
solana-keygen new --outfile ./_deploy/solareum-org.json
```


Solana get config 
https://docs.solana.com/running-validator/validator-start#configure-solana-cli
```
solana config get
solana-keygen pubkey ./_deploy/solareum-hot-wallet.json
solana-keygen pubkey ./_deploy/solareum-org.json
solana-keygen pubkey ./_deploy/solareum.json

solana config set --keypair ./_deploy/solareum-org.json
solana config set --keypair ./_deploy/solareum.json
```
