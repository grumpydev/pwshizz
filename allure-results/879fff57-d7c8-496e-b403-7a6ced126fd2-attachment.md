# Page snapshot

```yaml
- img
- text:  Invalid login Username
- textbox "Username": pwshizz
- text: Password
- textbox "Password"
- text: 
- link "Forgotten password":
  - /url: /api/password/forgot/?signin=8609f834d2fe073ca9eb098a1cebf719
- button "Login" [disabled]
- list:
  - text: or
  - listitem:
    - link " Login with Sharedo account can you see t...":
      - /url: https://core1-release-identity.sharedo.co.uk/external?provider=test-aad&signin=8609f834d2fe073ca9eb098a1cebf719
```