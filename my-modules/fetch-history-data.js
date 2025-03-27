// Cloud Firestoreから取得したデータを表示する
export const fetchHistoryData = async (getDocs, collection, query, orderBy, db) => {
  let tags = '';

  // reportsコレクションのデータを取得
  const querySnapshot = await getDocs(
    query(
      collection(db, 'reports'),
      orderBy('date', 'asc'), // 降順（新しい順）
    ),
  );

  // データをテーブル表の形式に合わせてHTMLに挿入
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${doc.data()}`);

    // 日付をフォーマットする
    const date = doc.data().date.toDate(); // FirestoreのTimestampをJSのDateオブジェクトに変換
    const formattedDate = formatDate(date);

    tags += `<tr><td>${formattedDate}</td><td>${doc.data().name}</td><td>${doc.data().work}</td><td>${doc.data().comment}</td></tr>`;
  });
  document.getElementById('js-history').innerHTML = tags;
};

// 日付をフォーマットする関数
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}