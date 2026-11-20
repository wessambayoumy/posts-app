import { describe, expect, it } from 'vitest';
import { Post } from '../../models/post.model';

describe('PostCard contract', () => {
  it('constructs a valid Post object', () => {
    const sample: Post = {
      id: 1,
      userId: 1,
      title: 'Sample title',
      body: 'Sample body',
    };

    expect(sample.id).toBe(1);
    expect(sample.title).toBe('Sample title');
  });
});
