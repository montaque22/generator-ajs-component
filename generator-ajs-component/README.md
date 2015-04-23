# generator-ajs-component [![Build Status](https://secure.travis-ci.org/montaque22/generator-ajs-component.png?branch=master)](https://travis-ci.org/montaque22/generator-ajs-component)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-ajs-component from npm, run:

```bash
npm install -g generator-ajs-component
```

Finally, initiate the generator:

```bash
yo ajs-component
```

To start the project just run:
```bash
gulp
```
That's it.... gulp.

### Cool Stuff It Can Do

This generator give you an angular project that uses gulp to handle compiling and building. 
The gulp file can generate your major files for you and inject them into your project.
```bash
gulp generate:directives --name pillow
```
The above code will generate the following in the directives folder:
```bash
...
|-directives
    |-pillow
        |-pillow.scss
        |-pillow.js
        |-pillow.html
...
```
The gulp file can generate controllers and directives so far but support for services and filters will be coming soon.
The folder structure is component driven so if your project is made up of individual functional pieces then this 
generator will work for you. The folder structure will resemble the following:

```bash
-Project Folder
  |- gulpfile.js
  |- other
  |- config
  |- files
  |-.templates (Don't Need to worry about this file. The gulp uses its contents to generate your files)
  |--public
      |-assets
          |-fonts
          |-images
      |-styles
          |-scss
              |-partials
      |-scripts
          |-controllers
          |-directives
          |-services
          |-filters
          |-vendors
      |-views
      |-index.html
```

## License

MIT
