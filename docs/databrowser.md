# Things to cover:
- shift from grid-based layout to row based layout.
- check out react-infinite. maybe there is some performance improvement over there.
- is it possible to fix misalignment problems because we can't influence when to reload
- is there a good schema to put Cells into modular components that work out-of-the-box (uncoupled from there parent environment)
- state management occurs on different levels to ensure that a proper way to do tabbing or "blurring".
- Implemented cells should manage blurring not, the cell wrapper (this should fix a lot of "hacky" stuff that we are doing currently)

Things we have learned by transitioning from Row-based layout to Grid-based layout:
We did it to first adapt our architecture to React-virtualized which would only render the visible grids. The problem is that it didn't work out, since otherwise the horizontal scrolling is very laggy.
Therefore the current version doesn't support just-in-time rendering for horizontal scrolling but only for vertical scrolling.

## Row Architectures:
### Features:
- misalignment shouldn't be an issue anymore
- same archtiecture for new and normal editing row (make use of higher order components to create similar rows without too much unstructured and conditional code)
- (smooth) infinite scrolling support (virtualscroll from react-virtualized?)
- easy design that we only have to iterate over the edges and then map them with existing or default field values

## Cell Architectures:
### Features:
- correct visualization independent from their environment
- onfocus changes the cell into an edit cell
- correct tabindexing
- support for multiple states:
  - add state:
    - enter => adds new node
    - shift + enter => new line
  - edit state:
    - enter => new line
    - shift + enter => add (still needs to be discussed)
  - similar in both states:
    - escape = > returns to previous value
