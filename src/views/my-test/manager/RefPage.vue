<template>
  <div class="PropSync">
    <h3>父组件</h3>
    <div>点击按钮可以看下console的打印信息</div>
    <button @click="getRef('btn')">操作"花真美"的ref</button><br/><br/><br/>
    <button @click="getRef('com')">操作'RefComponent'的ref</button><br/><br/>
    <button ref="aButton" style="padding:20px;">花真美</button><br/>

    <el-button type="primary" @click="testNet">测试网络</el-button>
    <el-input v-model="netMsg"></el-input>

    <br/><hr/><br/>
    <RefComponent name="RefComponent组件" ref="RefComponent"></RefComponent><br/>
    msg:{{msg}}
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Ref, Watch} from 'vue-property-decorator';
import RefComponent from "@/components/manager/RefComponent.vue";
import {getPerson} from "@/api/test";
import {Person} from "@/api/types";
import {getUsers} from "@/api/users";
  import {UserModule} from "@/store/modules/user";


@Component({
  components: { RefComponent },
})
export default class RefPage extends Vue {

  // @Ref() readonly RefComponent!: RefComponent;
  @Ref('RefComponent') readonly  RefC!: RefComponent;

  @Ref('aButton') readonly ref!: HTMLButtonElement;

  private msg = '';

  netMsg = '';
  

  async testNet() {
    const { data } = await getPerson();
    let person = (data as Person)

    this.netMsg += person.name

  }

  getRef(type: string) {
    if (type === 'btn') {
      console.log(this.ref);
      this.ref.style.backgroundColor = 'red';
      this.ref.style.color = '#fff';
    }
    if (type === 'com') {
      console.log(this.RefC);
      this.msg = (this.RefC as any).getname('ddd');
    }
  }

  // !: 表示一定存在，?: 表示可能不存在。这两种在语法上叫赋值断言

  // @Prop(options: (PropOptions | Constructor[] | Constructor) = {})
  // PropOptions，可以使用以下选项：type，default，required，validator
  // Constructor[]，指定 prop 的可选类型
  // Constructor，例如String，Number，Boolean等，指定 prop 的类型
  // @Watch(path: string, options: WatchOptions = {})
  // options包含两个属性 immediate?:boolean  侦听开始之后是否立即调用该回调函数 / deep?:boolean 被侦听的对象的属性被改变时，是否调用该回调函数
  // @Watch('arr', { immediate: true, deep: true })
  // onArrChanged(newValue: number[], oldValue: number[]) {}

  // @Emit(event?: string)
  // @Emit 装饰器接收一个可选参数，该参数是$Emit的第一个参数，充当事件名。如果没有提供这个参数，$Emit会将回调函数名的camelCase转为kebab-case，并将其作为事件名
  // @Emit会将回调函数的返回值作为第二个参数，如果返回值是一个Promise对象，$emit会在Promise对象被标记为resolved之后触发
  // @Emit的回调函数的参数，会放在其返回值之后，一起被$emit当做参数使用

  // @Ref(refKey?: string)
  // @Ref 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数


  @Watch("netMsg",{deep:true,immediate:true})
  watchNetMsg(newMsg:string){
    console.log(newMsg)
  }
  // @Ref('aButton') readonly button!: HTMLButtonElement
}
</script>
