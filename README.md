# ChromosomeBuilder
Reattaches overlapping DNA sequences in FASTA format to form full chromosome sequence.

To use:
place fasta file into same directory and name as "FASTA_dataset.txt"
run node chromosomeBuilder.js

Chromosome DNA sequence result will appear in file: "finished_sequence.txt"


Approach:

- I wrote a function that reads in the FASTA data and converts it into an object which stores each id and sequence, which can be seen in "linked_sequences.txt".
- Then I wrote a function that splits each sequence in half.  I recursively take the right half of the sequence and match it to the other sequences.
- Upon finding a match, I then slice the matched sequence from index 0 to the index the match was found at, and match it back to the right side of the first sequence to ensure that the ends can be glued together.
- If a reciprocal match is found, I use a doubly linked list data structure to store the left and right links of the sequences, and store a sliced version of the left string to remove overlap between left and right.
- Once all sequences have been matched and linked, I call the attachSequences function which begins from the sequence that has no left match, and accumulates the righthand slices in the sequenceAccumulator.
- The final dna sequence is then written to "finished_sequence.txt".
