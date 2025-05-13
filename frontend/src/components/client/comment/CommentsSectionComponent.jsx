import React, { useState, useEffect } from "react";
import CommentFormComponent from "./CommentFormComponent";
import CommentItemComponent from "./CommentItemComponent";

// Hàm tính tổng số bình luận
const calculateTotalComments = (comments) => {
  let total = comments.length;
  comments.forEach((comment) => {
    if (comment.children && comment.children.length > 0) {
      total += calculateTotalComments(comment.children);
    }
  });
  return total;
};

// Xóa bình luận
const removeCommentFromTree = (comments, commentId, parentId) => {
  return comments.map((comment) => {
    if (comment._id === parentId && comment.children) {
      return {
        ...comment,
        children: comment.children.filter((child) => child._id !== commentId),
      };
    }
    if (comment.children && comment.children.length > 0) {
      return {
        ...comment,
        children: removeCommentFromTree(comment.children, commentId, parentId),
      };
    }
    return comment;
  });
};

// Thêm bình luận
const addCommentToTree = (comments, newComment) => {
  return comments.map((comment) => {
    if (comment._id === newComment.parent_id) {
      return {
        ...comment,
        children: [...(comment.children || []), newComment],
      };
    }
    if (comment.children && comment.children.length > 0) {
      return {
        ...comment,
        children: addCommentToTree(comment.children, newComment),
      };
    }
    return comment;
  });
};

const CommentsSectionComponent = ({
  bookId,
  initialComments,
  initialTotal,
  onCommentsUpdated,
}) => {
  const [comments, setComments] = useState(initialComments || []);
  const [totalComments, setTotalComments] = useState(
    initialTotal ? calculateTotalComments(initialComments) : 0
  );

  useEffect(() => {
    const newTotal = calculateTotalComments(comments);
    setTotalComments(newTotal);
    onCommentsUpdated({ comments, total: newTotal });
  }, [comments, onCommentsUpdated]);

  const handleCommentAdded = (newComment) => {
    let updatedComments;
    if (!newComment.parent_id) {
      updatedComments = [newComment, ...comments];
    } else {
      updatedComments = addCommentToTree([...comments], newComment);
    }
    setComments(updatedComments);
    const newTotal = calculateTotalComments(updatedComments);
    setTotalComments(newTotal);
    onCommentsUpdated({ comments: updatedComments, total: newTotal });
  };

  const handleCommentDeleted = (commentId, parentId, isChildComment) => {
    let updatedComments;
    if (!isChildComment) {
      updatedComments = comments.filter((comment) => comment._id !== commentId);
    } else {
      updatedComments = removeCommentFromTree(
        [...comments],
        commentId,
        parentId
      );
    }

    setComments([...updatedComments]);
  };

  return (
    <section className="comments-section mt-5">
      <h5>Bình luận ({totalComments})</h5>
      <CommentFormComponent
        bookId={bookId}
        onCommentAdded={handleCommentAdded}
      />
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItemComponent
            key={comment._id}
            comment={comment}
            bookId={bookId}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        ))
      ) : (
        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
      )}
    </section>
  );
};

export default CommentsSectionComponent;
