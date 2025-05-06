import React, { useState, useEffect } from "react";
import CommentFormComponent from "./CommentFormComponent";
import CommentItemComponent from "./CommentItemComponent";

// Hàm tính tổng số bình luận (bao gồm cả bình luận con)
const calculateTotalComments = (comments) => {
  let total = comments.length;
  comments.forEach((comment) => {
    if (comment.children && comment.children.length > 0) {
      total += calculateTotalComments(comment.children);
    }
  });
  return total;
};

// Hàm đệ quy để xóa bình luận con cụ thể mà không ảnh hưởng đến bình luận cha
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
    if (newComment.parent_id) {
      updatedComments = comments.map((comment) =>
        comment._id === newComment.parent_id
          ? {
              ...comment,
              children: [...(comment.children || []), newComment],
            }
          : comment
      );
    } else {
      updatedComments = [newComment, ...comments];
    }
    setComments([...updatedComments]); // Tạo bản sao mới để đảm bảo re-render
    const newTotal = calculateTotalComments(updatedComments);
    setTotalComments(newTotal);
    onCommentsUpdated({ comments: updatedComments, total: newTotal });
  };

  const handleCommentDeleted = (commentId, parentId, isChildComment) => {
    let updatedComments;
    if (!isChildComment) {
      // Nếu là bình luận cha, xóa toàn bộ cây bình luận (TH2)
      updatedComments = comments.filter((comment) => comment._id !== commentId);
    } else {
      // Nếu là bình luận con, chỉ xóa bình luận con cụ thể (TH1)
      updatedComments = removeCommentFromTree(
        [...comments],
        commentId,
        parentId
      );
    }

    setComments([...updatedComments]); // Tạo bản sao mới để đảm bảo re-render
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
