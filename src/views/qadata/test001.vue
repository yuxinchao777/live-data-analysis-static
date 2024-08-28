<template>
  <div>
  <h1>{{testname1}}</h1>
  <h1 v-html="content"></h1>
  <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
  <button type="primary" @click="submit">提交</button>

  </div>
</template>

<script>
import quillEditor from '@/components/Editor/QuillEditor.vue'


export default {
  name: 'test001',
  components :{quillEditor},
  data(){
    return{
      content: '111',
      editorOption: {
                    placeholder: 'Hello World'
                }
    }
  },
  methods:{
    onEditorChange({ editor, html, text }) {
      this.content = html;
            },
    submit(){
      
      alert(this.content)
      this.$message.success('提交成功！');
            }
  },
  computed:{
    testname1:function(){
      return 222
    },

    
  }, 
  watch: {
     
    
  },

}


</script>

<style scoped>

</style>