# 忘備録

なぜこのような構造にしたのか？

1.EventListenerをsystemsEvent.jsやcomponentsEvent.jsにまとめているのはなぜ？
A.各種ComponentがeventListenerを持っているという形にしてしまうと、もし参照したいcomponentがなかった場合にundefinedエラーを吐いてしまうが、まとめてworldやentityにおいておくことでそのコンポーネントがなくても、EventListener.add('event')ができるという点に価値を見出したため。

2.EventListenerがあるにも関わらずcomponentが他componentsやsystemsにアクセスできるようにしたのはなぜ？
A.値を参照したいだけの時にも一々EventListener経由で値を渡すのが面倒くさいと思ったから。
その代わり、他componentsやsystemsの値を直接変更するような事はしない方針。

~~3.Motionクラスを作成した後にそのMotionクラスにset()する、あるいは最初のコンスラクターで代入する形にしたのはなぜ？~~
~~A.コンストラクターの引数が増え過ぎてしまうのが一つと。~~
~~後は例えばTweenクラスという名称に対して、どのコンポーネントを参照して、変更するかという機能を盛り込むのは一つのクラスに対して、二つの役割を割り当てている気がしたから。~~
結局Motionクラスをextendsして実装しました。

4.timelineComponentにaddされたmotionを保持して、timelineの変更を検知したときにtimelineComponentに保持されているmotionを一斉に変更する。

5.~~motionはmapで管理。具体的には{key: global.start, value: motion}の形で管理する。~~
時間で管理するのではなく、motion数で管理することに。途中でentityを増やした場合はその前にいくつのmotionが入っているべきだったのかを保持する変数に記録する。

6.entityはcrypt.randomUUID()で管理し、entity.delet()でインスタンスを削除できる仕様にする。

7.eventlistenerはaddされた際にreturnでuuidを発行し、イベントを削除できるように。

8.継承前提のクラスはなるべくコンストラクターに引数を使用しないように。
A.コンストラクターに引数を使用してしまうと、superする際に毎回引数を指定しないといけなくてとても面倒くさいから。

# 佐藤ファイルの取り扱い。
1.motionDataからmotionを取り出す