const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

// Track user reactions (in-memory)
const userReactions = {};

// ==========================================
// GET ALL POSTS
// ==========================================
router.get('/posts', (req, res) => {
    db.all(`
        SELECT community_posts.*,
        (SELECT COUNT(*) FROM community_comments WHERE community_comments.post_id = community_posts.id) as comment_count
        FROM community_posts 
        WHERE community_posts.is_active = 1
        ORDER BY created_at DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, posts: rows });
    });
});

// ==========================================
// CREATE POST
// ==========================================
router.post('/posts', (req, res) => {
    const { title, content, author, authorId } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content required' });
    }
    db.run(
        `INSERT INTO community_posts (title, content, author, author_id) VALUES (?, ?, ?, ?)`,
        [title, content, author || 'Anonymous Farmer', authorId || null],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Post created!', postId: this.lastID });
        }
    );
});

// ==========================================
// TOGGLE POST LIKE
// ==========================================
router.post('/posts/:id/like-toggle', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const key = `post_${req.params.id}`;
    if (!userReactions[userId]) userReactions[userId] = {};
    const current = userReactions[userId][key];

    db.get('SELECT likes FROM community_posts WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ success: false, message: 'Post not found' });

        let likes = row.likes || 0;
        let action;

        if (current === 'like') {
            likes = Math.max(0, likes - 1);
            delete userReactions[userId][key];
            action = 'unliked';
        } else {
            likes = likes + 1;
            userReactions[userId][key] = 'like';
            action = 'liked';
        }

        db.run('UPDATE community_posts SET likes = ? WHERE id = ?', [likes, req.params.id], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, action, likes, userReaction: userReactions[userId][key] || null });
        });
    });
});

// ==========================================
// GET POST COMMENTS
// ==========================================
router.get('/posts/:id/comments', (req, res) => {
    db.all('SELECT * FROM community_comments WHERE post_id = ? ORDER BY created_at ASC', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, comments: rows });
    });
});

// ==========================================
// ADD COMMENT
// ==========================================
router.post('/posts/:id/comments', (req, res) => {
    const { author, comment, authorId, parentId } = req.body;
    if (!comment) return res.status(400).json({ success: false, message: 'Comment required' });

    db.run(
        `INSERT INTO community_comments (post_id, author, comment, author_id, parent_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, author || 'Anonymous', comment, authorId || null, parentId || null],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Comment posted!', commentId: this.lastID });
        }
    );
});

// ==========================================
// TOGGLE COMMENT LIKE
// ==========================================
router.post('/comments/:id/like-toggle', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const key = `comment_${req.params.id}`;
    if (!userReactions[userId]) userReactions[userId] = {};
    const current = userReactions[userId][key];

    db.get('SELECT likes, dislikes FROM community_comments WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ success: false, message: 'Comment not found' });

        let likes = row.likes || 0;
        let dislikes = row.dislikes || 0;
        let action;

        if (current === 'like') {
            likes = Math.max(0, likes - 1);
            delete userReactions[userId][key];
            action = 'unliked';
        } else if (current === 'dislike') {
            dislikes = Math.max(0, dislikes - 1);
            likes = likes + 1;
            userReactions[userId][key] = 'like';
            action = 'liked';
        } else {
            likes = likes + 1;
            userReactions[userId][key] = 'like';
            action = 'liked';
        }

        db.run('UPDATE community_comments SET likes = ?, dislikes = ? WHERE id = ?',
            [likes, dislikes, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, action, likes, dislikes, userReaction: userReactions[userId][key] || null });
            }
        );
    });
});

// ==========================================
// TOGGLE COMMENT DISLIKE
// ==========================================
router.post('/comments/:id/dislike-toggle', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const key = `comment_${req.params.id}`;
    if (!userReactions[userId]) userReactions[userId] = {};
    const current = userReactions[userId][key];

    db.get('SELECT likes, dislikes FROM community_comments WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ success: false, message: 'Comment not found' });

        let likes = row.likes || 0;
        let dislikes = row.dislikes || 0;
        let action;

        if (current === 'dislike') {
            dislikes = Math.max(0, dislikes - 1);
            delete userReactions[userId][key];
            action = 'undisliked';
        } else if (current === 'like') {
            likes = Math.max(0, likes - 1);
            dislikes = dislikes + 1;
            userReactions[userId][key] = 'dislike';
            action = 'disliked';
        } else {
            dislikes = dislikes + 1;
            userReactions[userId][key] = 'dislike';
            action = 'disliked';
        }

        db.run('UPDATE community_comments SET likes = ?, dislikes = ? WHERE id = ?',
            [likes, dislikes, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, action, likes, dislikes, userReaction: userReactions[userId][key] || null });
            }
        );
    });
});

// ==========================================
// REPLY TO COMMENT
// ==========================================
router.post('/comments/:id/reply', (req, res) => {
    const { author, authorId, reply } = req.body;
    if (!reply) return res.status(400).json({ success: false, message: 'Reply required' });

    db.get('SELECT post_id FROM community_comments WHERE id = ?', [req.params.id], (err, parent) => {
        if (err || !parent) return res.status(404).json({ success: false, message: 'Parent not found' });

        db.run(
            `INSERT INTO community_comments (post_id, author, comment, author_id, parent_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [parent.post_id, author || 'Anonymous', reply, authorId || null, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: 'Reply posted!', replyId: this.lastID });
            }
        );
    });
});

module.exports = router;