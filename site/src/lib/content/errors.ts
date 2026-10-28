/** A content problem that must stop the build, tagged with the source path. */
export class ContentError extends Error {
  readonly source: string;
  constructor(message: string, source: string) {
    super(`[content] ${source}: ${message}`);
    this.name = 'ContentError';
    this.source = source;
  }
}
