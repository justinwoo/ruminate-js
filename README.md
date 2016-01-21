# Ruminate.js

"Ruminate data in your app like a cow ruminates food"

Not the best ever, mostly just a playground implementing a worse Cycle.js where instead of having proper driver functions and only two things provided to `Cycle.run`, you instead have `init` (food), `main(sources): sinks` (a cow's mouth), and `drivers(sinks): sources`.

Basically like a cow:

```
Eat food -----food--------> Rumen ("stomach") ---cud---> Mouth ---
                      ^                                          |
                      |                                          |
                      ----------------chewed cud------------------
```

And so the types match:

```
constructor(init: T, main: (sources: R) => T, drivers: (inputs: T) => R)
```

where `T` is bounded for being an object (kind of a workaround for Flow not being cooperative).

Of course, this means `init` and the output of `main` have to be the same type, which is kind of annoying. Well... I didn't say this was perfect, did I?

If you want to play around with this, just clone this repo and add a spec and see if it works.

Problems:

* Obviously worse than Cycle in a lot of ways, and the whole Flow type checking experience isn't the best either. But at least circular types work. That's the main thing I was going for.

* Subscription to the sinks from `main` output by input proxy rather than doing so on subscription to input proxy. Kind of lazy so I didn't try to solve this manually. I suspect there's a cleaner solution to this.

* No real reason to use this over setting up your own proxy subjects really. I've written React apps using proxy subjects for quite a while now.
