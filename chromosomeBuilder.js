fs = require('fs');
var data_set = '';

//turns FASTA format into object with id, index and sequence
var sequencer = function(data_set){
    var sequences = data_set.replace(/(\r\n|\n|\r)/gm,"");
    sequences = sequences.split('>Rosalind_');
    sequences = sequences.slice(1,sequences.length);
    var sequence_arr = [];
    for(s=0; s<sequences.length; s++){
        var sq={};
        sq.id = sequences[s].slice(0, 4);
        sq.index = s;
        sq.sequence = sequences[s].slice(4);
        sq.leftMatches = [];
        sq.rightMatches = [];
        // console.log(id);
        sequence_arr[s] = sq;
    }
    return sequence_arr;
}

var writeFile = function(filename, contents){
    fs.writeFile(filename, contents, function (err) {
      if (err) return console.log(err);
    });
}

var getLeftSubstring = function(sequence){
    minSliceLength = Math.ceil(sequence.length/2);
    return sequence.slice(0, minSliceLength);
}

var getRightSubstring = function(sequence){
    minSliceLength = Math.ceil(sequence.length/2);
    return sequence.substr(sequence.length-minSliceLength);
}

var linkSequences = function(sequences, sequenceIndex){
    if(!sequenceIndex){
        sequenceIndex = 0;
    }else if(sequenceIndex>sequences.length-1){ //if we have checked through all sequences
        // console.log(sequences);
        // console.log("finished checking through sequences");
        return sequences;
    }
    var left = getLeftSubstring(sequences[sequenceIndex].sequence);
    for(sequenceIndex2=0; sequenceIndex2<sequences.length; sequenceIndex2++){
        var match = sequences[sequenceIndex2].sequence.match(left);
        if(sequenceIndex!=sequenceIndex2 && match){
            // console.log('match found at sequence index: ', sequenceIndex2);
            // console.log('match: ', match);
            // console.log('slice: ', sequences[sequenceIndex2].sequence.slice(match.index, sequences[sequenceIndex2].sequence.length))
            slice = sequences[sequenceIndex2].sequence.slice(match.index, sequences[sequenceIndex2].sequence.length);
            match = sequences[sequenceIndex].sequence.match(slice);
            if(match){
                // console.log('reciprocal match found at sequence index: ', sequenceIndex, ' and ', sequenceIndex2);
                sequences[sequenceIndex].leftMatches.push(sequenceIndex2);
                sequences[sequenceIndex2].rightMatches.push(sequenceIndex);
            }
        }
    }
    linkSequences(sequences, sequenceIndex+1)
    return sequences;
}

var attachSequences = function(linked_sequences, sequenceAccumulator, sequenceIdx){
    if(!sequenceAccumulator){
        sequenceAccumulator='';
        for(idx=0; idx<linked_sequences.length; idx++){
            if(linked_sequences[idx].leftMatches.length==0){
                sequenceIdx = idx;
            }
        }
    }else if(linked_sequences[sequenceIdx].rightMatches.length==0){
        return sequenceAccumulator;
    }
    sequenceAccumulator+=linked_sequences[sequenceIdx].sequence;
    return attachSequences(linked_sequences, sequenceAccumulator, linked_sequences[sequenceIdx].rightMatches[0]);
}

fs.readFile('FASTA_dataset.txt', 'utf8', function(err, data){
    if(err){
        return console.log(err);
    }
    var sequences = sequencer(data);
    var linked_sequences = linkSequences(sequences);
    writeFile('linked_sequences.txt', JSON.stringify(linked_sequences, null, 2));
    var finished_sequence = attachSequences(linked_sequences);
    writeFile('finished_sequence.txt', finished_sequence);

});
