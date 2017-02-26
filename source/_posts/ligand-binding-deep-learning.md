---
title: Ligand binding affinity prediction using deep learning
date: 2017-02-24 16:00:00
---

# Preamble

I'm not an domain expert in protein binding or even biochemistry, but I have a strong interest in hacking with machines.
Using an abstract view on life shows that we are just DNA based machines.
The architecture is very different to the current silicon based machines, but I expect in the not so far future it will blur more and more.
That's how protein binding got my attention.

# Idea

Two years ago I investigated the idea of using deep learning to make predictions for ligand binding affinity.
The basic idea is very simple:
There are many known molecules and their binding affinity to specific receptors.
The sum of information of all these molecules to a specific receptor is like a negative of the receptor itself.
Training a neural network with the information of many molecules to a single receptor would make the neural network itself a negative of the receptor.

# Problems

## Data

Usually one problem is how to collect all the data.
But with my Linked Data background that was quite easy.
Use SPARQL to select the required information, done.
But [ChEMBL](https://www.ebi.ac.uk/chembl/) is not the biggest public database.
So I wrote a small CSV to RDF converter for [PDSB Ki database](https://github.com/bergos/ligand-binding-db-ki-database) and [BindingDB](https://github.com/bergos/ligand-binding-db-bindingdb). 

## Feeding the neural network

Another problem, which wasn't solved at that time, was how to feed the neural network with the molecules?
The data structure of a molecule is a graph.
How can you feed a graph to a neural network?
I thought about the method used to feed text to neural networks.
Each character or token gets a own input neuron.
Text representations for molecules could be split into tokens.
Even more specific than ASCII codes.
So I had a look at different representations of molecules.
One candidate was [InChI](https://en.wikipedia.org/wiki/International_Chemical_Identifier).
InChI is canonical, which allows easy lookups in databases.
One big drawback is the structure of the format.
There are different layers, one after the other, and the information of the different layers must be combined to build the molecule.
That means the distance in the 1D text representation can be very big compared to the distance in the graph.
The next candidate was [SMILES](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system).
SMILES doesn't have that drawback of the big distances in the representation.
The format isn't canonical out of the box, but there are algorithms to make canonical representations of any SMILES definition.
This looks like a drawback, but it is very useful for training the neural network.
There is a limited amount of data.
Alternative representations could be used for data augmentation.
[Open Babel](http://openbabel.org/) has a feature to generate these alternative representations.
It's also nice during testing using alternative representations.
The output for alternative representations of a molecule should be the same, if you understand SMILES.
Using alternative representations in the test data allows to verify if the neural network understands SMILES.
Spoiler: After a while the output becomes very close for the alternatives!

## Neural network model

The neural network model is very simple.
There is an input neuron for every possible token.
All neurons are 0 except the current token.
That neuron will get the value 1.
Than all tokens are feed to the model in sequence.
There is only one output neuron.
The value of the output should be 1 at the end of the sequence if the molecule binds or 0 if it doesn't bind.
With bigger datasets it could be possible to use the Ki value as output to make a more detailed prediction.

# Implementation

Contrary to most deep learning projects I choose JavaScript for most of the code.
Only a small part is written in Python using [Keras](https://keras.io/).
The decision was made based on my other deep learning projects.
I will write a blog post about it later.

For this project I developed some generic utils, which can be used also for other use cases.

## Generic tools

- [Keras Gaia](https://github.com/bergos/keras_gaia) handles datasets and models for Keras in simple project definitions (Python project).
- [SMILES parser and serializer](https://github.com/bergos/smiles) is used to split the SMILES strings to tokens.
  It also works the other way round.
- The [Open Babel](https://github.com/bergos/openbabel-cli) command line wrapper is used to generate the canonical SMILES string and the alternatives.
- [nn-mapping](https://github.com/bergos/nn-mapping) maps the selected JSON data to neural network ready data.

The ligand binding code is also separated into sub projects to make them more reusable.

## Ligand binding

- The [PDSB Ki database](https://github.com/bergos/ligand-binding-db-ki-database) mapping and SPARQL server.
- The [BindingDB](https://github.com/bergos/ligand-binding-db-bindingdb) mapping and SPARQL server.
- The [utils](https://github.com/bergos/ligand-binding-utils) with generic code for the import and the mapping of the ligand binding data.
- Command line programs for [processing ligand binding data](https://github.com/bergos/ligand-binding-processing).
- Complete pipeline to run the [ligand binding deep learning](https://github.com/bergos/ligand-binding-deep-learning) including prepared examples.

# Results

The output of the test dataset varied for each receptor.
Looking at the output of a single test molecule doesn't allow to make a prediction.
But a look at all test molecules shows a clear pattern.
Sorting the molecules by the output value gives a much higher chance to find a good candidate.
Because of the lack of negative data the test dataset is very small.
But with rotated datasets the result could be reproduced.

This diagram shows the sorted results for the 5ht2a receptor using 75 alternatives per molecule.

{% raw %}
 <div style="overflow-x: scroll;">
   <div id="container" style="width: 4000px; height: 500px;"></div>
 </div>

 <script src="https://code.highcharts.com/highcharts.js"></script>
 <script src="https://code.highcharts.com/highcharts-more.js"></script>
 <script src="/files/highcharts-theme.js"></script>
 <script src="/files/ligand-binding-deep-learning-5ht2a75.js"></script>
{% endraw %}

With these results I expect this method could be useful to check big datasets of molecules.
The training for a single receptor took about 1 day on a Nvidia GTX980.
But the prediction is done in seconds.
This allows to select good candidates for further tests.

I expect it should be also possible to predict other properties of molecules.
Toxicity could be a good candidate.
With a very big dataset it could be even possible to predict the LD50 value.

# Conclusion

Why did it take two years to publish the idea and to release the code?
As I already mention, I'm not a domain expert.
The idea was so different to what I found on the Web, so I wasn't sure if the idea is ahead of it's time or just stupid.
One year after I had this idea I talked to a colleague who had some experience in that field.
He encouraged me to test the idea.
Also other colleagues ask me than: Why hasn't somebody else already implemented it?
How good does it perform compared to existing solutions?
The result looked pretty good, but I didn't found any test dataset to benchmark it against other methods.
Also it was just a spare time project at that time.
All that delayed the release for such a long time.
But now, after similar approaches showed up, I'd like to say:

**Don't be afraid of ideas which are very different to current state of the art technology, especially if you are working in the field of deep learning!**

Parts of this project now moved from my spare time to something we will support with the company I'm CTO for, [Zazuko GmbH](http://zazuko.com/).
We have plans of using deep learning in other contexts as well, for example entity linking.
If you need any support in deep learning and linked data, don't hesitate to [contact us](mailto:info@zazuko.com?subject=Keras/Gaia)!

I expect much better results with a database which contains much more entries about molecules which don't bind to a receptor.
But usually such data doesn't get published.
In general we will need much more data negative data for machine learning.
So I also would like to say:

**Please, publish your failures!**

## Related projects

In the meantime some other projects use SMILES to feed neural networks with molecule structures or auto encoders which generate molecules.
A very similar projects is described in the paper [Generating Focussed Molecule Libraries for Drug Discovery with Recurrent Neural Networks](https://arxiv.org/abs/1701.01329).

Short comparison (mine, paper):

- Property used to rate the molecule: Ki value / IC50 
- Database: BindingDB / ChEMBL
- Data augmentation: Alternative SMILES using Open Babel / none 

I also used the 5ht2a receptor for testing and also tried just the ChEMBL database without alternatives.
The quality for the neural network should increase by a significant amount using the bigger dataset and the alternatives.  

Edit: I was pointed to the paper [Learning to SMILE(S)](https://arxiv.org/abs/1602.06289), which seems to be the first public paper about the method to feed molecules to neural networks.
