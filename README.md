# Vicunia - Alpaca.cpp Chat Frontend and Tooling

Vicunia is a frontend for using [alpaca.cpp](https://github.com/antimatter15/alpaca.cpp) and providing a GUI for installing and chatting with Stanford Alpaca and other models from the `llama.cpp` family. It's available for Windows, Linux and Mac

![Vicunia](img/vicunia-mockup1.png)

## Download

See [releases](https://github.com/EliasVincent/vicunia/releases) for the latest version.

## Setup

**Follow the guide on** [alpaca.cpp](https://github.com/antimatter15/alpaca.cpp)!

TL;DR: have a working and **compiled** alpaca.cpp folder with a model in your OS home directory (Windows: `C:\Users\%USERNAME%\alpaca.cpp`, Linux: `/home/%USERNAME%/alpaca.cpp`, macOS: `/Users/%USERNAME%/alpaca.cpp`). The compiled binaries (chat.exe, etc..) and model should be in the root of the alpaca.cpp folder.

## Troubleshooting

If current Alpaca.cpp throws errors, [I have tested branches on my fork](https://github.com/EliasVincent/alpaca.cpp/branches) that work with Vicunia.

## TODO

- Easy one-click download and setup
- ship with `X.cpp` binaries (which one will be determined as better models and cpp forks are releasing very quickly right now)
- just choose the executable
- more options

## How to use [gpt4all](https://github.com/nomic-ai/gpt4all) (for now)

- download quantized model into the `chat` folder
- rename executable to `chat` or `chat.exe`
- paste path to `chat` folder in the options menu

## Credits

- [alpaca.cpp](https://github.com/antimatter15/alpaca.cpp)
- [llama.cpp](https://github.com/ggerganov/llama.cpp)
- [dalai](https://github.com/cocktailpeanut/dalai)

![vicunia-logo](img/vicunia-logo.png)
