export interface FileReaderInterface<T> {
  read(): AsyncIterable<T>;
}
