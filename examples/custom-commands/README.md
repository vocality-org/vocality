Example adding multiple commands and subcommands to a bot.

commands:

```
├── cowsay
│   ├── say
│   └── think
└── ping
```

Examples:

Message: `cowsay foo`

Response:

```
 _____
< foo >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

```

Message: `cowsay think bar`

Response:

```
 _____
< bar >
 -----
        \   ^__^
         \  (--)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

```

Message: `ping`

Response: `pong`
