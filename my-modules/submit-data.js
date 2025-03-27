// 全ての入力フィールドが埋まっているか確認する関数
function validateForm(formData) {
  const requiredFields = ['name', 'work', 'comment']; // 必須項目のフィールド名

  for (const field of requiredFields) {
    if (!formData.get(field) || formData.get(field).trim() === '') {
      return false; // 空の入力欄があればfalseを返す
    }
  }

  return true; // 全ての入力欄が埋まっていればtrueを返す
}

// Cloud Firestoreにデータを送信する
export const submitData = async (e, addDoc, collection, db) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // 入力バリデーションを実行
  if (!validateForm(formData)) {
    showToastMessage('全ての項目を入力してください', true);
    return; // 送信処理を中止
  }

  try {
    const docRef = await addDoc(collection(db, 'reports'), {
      date: new Date(),
      name: formData.get('name'),
      work: formData.get('work'),
      comment: formData.get('comment'),
    });
    console.log('Document written with ID: ', docRef.id);

    // フォームをリセットする
    e.target.reset();

    // nameフィールドにフォーカスを設定
    const nameInput = e.target.querySelector('[name="name"]');
    if (nameInput) {
      nameInput.focus();
    }

    // 送信成功メッセージを表示
    showToastMessage('送信しました');
  } catch (e) {
    console.error('Error adding document: ', e);

    // エラーメッセージを表示（オプション）
    showToastMessage('エラーが発生しました', true);
  }
};

// ページ読み込み時にnameフィールドにフォーカスする関数
export const focusNameField = () => {
  // nameフィールドを取得してフォーカス
  const nameInput = document.querySelector('form [name="name"]');
  if (nameInput) {
    nameInput.focus();
  }
};

// トーストメッセージを表示する関数
function showToastMessage(message, isError = false) {
  // 既存のトースト要素があれば削除
  const existingToast = document.getElementById('toast-message');
  if (existingToast) {
    existingToast.remove();
  }

  // トースト要素を作成
  const toast = document.createElement('div');
  toast.id = 'toast-message';
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.top = '0';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.style.color = 'white';
  toast.style.backgroundColor = isError ? '#ff3860' : '#48c774';
  toast.style.zIndex = '1000';
  toast.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16)';

  // トーストをDOMに追加
  document.body.appendChild(toast);

  // 3秒後にトーストを消す
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 1000);
}
