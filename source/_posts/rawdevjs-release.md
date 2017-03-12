---
title: RawDevJS Release
date: 2017-03-12 20:00:00
tags:
 - RawDevJS
 - JavaScript
---

It's been a while since I was working actively on my JavaScript [raw image developer](https://en.wikipedia.org/wiki/Raw_image_format) called [RawDevJS](http://rawdev.bergnet.org/).
In 2012 I ported [RawDev](http://www.bergphoto.org/), my C++ raw developer, to JavaScript.
One year before [pics.io](https://gigaom.com/2013/04/10/smile-photographers-pics-io-delivers-raw-photo-edits-in-the-browser/), the first commercial service, was available.
New APIs like [WebWorker](www.whatwg.org/specs/web-workers/current-work/), [WebGL](https://www.khronos.org/webgl/) and [WebCL](https://www.khronos.org/webcl/) have made it possible to implement fast image processing applications in JavaScript.
At the parallel 2013 conference I showed the possibilities of [JavaScript Parallel Computing APIs](https://www.parallelcon.de/2013/lecture.php?id=2187) on the basis of RawDevJS. The slides are available [here](https://www.bergnet.org/people/bergi/files/documents/2013-05-04/index.html).
I also gave a talk about it at the MunichJS JavaScript Meetup in September 2013 with the title [RawDevJS – ein JavaScript Raw Entwickler](http://www.munichjs.org/meetups/?event_id=41) (even if the title is German, the talk was in English - A spontaneous decision).

I thought soon we will have real cloud image processing apps.
But now, 5 years later, there is only [pics.io](https://pics.io/), which I didn't even know until now.
I discovered it while I was searching for links for this blog post.

I have too many other projects to continue my work on this project, so I decided to make it open source.
I'm pavonine when it comes to code, so I made a quick rewrite in ES6.
The WebWorker code was removed, because it didn't work anymore with the current version of Node.js.
I had already a look at more up to date libraries to bring back that feature.
The performance gain would be big, so it would be worth to have a look at this.
The WebGL code used a different filter pipeline and today there are better options to write filters for JavaScript and WebGL, like [turbo.js](https://github.com/turbo/js) and [glsl-transpiler](https://github.com/stackgl/glsl-transpiler).
That's why I also skipped that part.
The WebCL code was written before the spec was final.
I even had to adapt the code during development to the API changes.
Also there is no native support for WebCL by any browser until now.
So I also skipped that part.

The result is available at the [RawDevJS organization on GitHub](https://github.com/rawdevjs), which contains 18 repositories today.
One of them is [rawdevjs-browser](https://github.com/rawdevjs/rawdevjs-browser) fetches and renders DNG images into [Blob URLs](https://www.w3.org/TR/FileAPI/#DefinitionOfScheme), which can be display using an `image` element.

    <div class="rawdevjs" data-src="http://static.bergnet.org/IMG_8801.dng"></div>

Another one is [rawdevjs-cli](https://github.com/rawdevjs/rawdevjs-cli), a command line tool to convert DNG images to PNG images.

If you are interested in participating or in adopting that project, please contact me!
